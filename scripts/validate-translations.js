#!/usr/bin/env node

/**
 * Translation Validation Script
 *
 * Validates:
 * 1. JSON syntax in all locale files
 * 2. Key parity across all locales (cs.json is reference)
 * 3. Hardcoded strings in JSX/TSX files using AST parsing
 * 4. Unused translation keys
 * 5. Interpolation variable consistency
 *
 * Usage:
 *   node scripts/validate-translations.js
 *   npm run validate:translations
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const ts = require('typescript');

const LOCALES = ['cs', 'en', 'sk', 'pl', 'hu'];
const MESSAGES_DIR = path.join(__dirname, '../src/messages');
const SRC_DIR = path.join(__dirname, '../src');

// Keys that are allowed to be unused (e.g. dynamic keys, metadata)
const UNUSED_KEYS_ALLOWLIST = [
  /^metadata_/,
  /^seo_/,
  /^category_/, // often used dynamically
  /^calculators\./, // dynamic calculator loading
  /_description$/, // often used dynamically
  /_title$/, // often used dynamically
  /_keywords$/, // often used dynamically
];

// Content to ignore in hardcoded string detection
const IGNORED_TEXT_CONTENT = [
  /^\s*$/, // whitespace
  /^[0-9\s.,%+\-/*=()]*$/, // numbers and math symbols
  /^https?:\/\//, // URLs
  /^[a-zA-Z0-9_-]+$/, // ID-like strings, simple codes (risky, but reduces noise)
  /^[{}]*$/, // just braces
  /^&[a-z]+;$/, // HTML entities
];

// JSX attributes to check for hardcoded strings
const CHECK_ATTRIBUTES = new Set([
  'placeholder',
  'title',
  'alt',
  'label',
  'description',
  'aria-label',
  'defaultValue', // sometimes visible
]);

let errors = [];
let warnings = [];

console.log(chalk.blue.bold('\n🔍 Translation Validation (AST Enhanced)\n'));

// --- Phase 1: JSON Syntax ---

function validateJsonSyntax() {
  console.log(chalk.cyan('📄 Phase 1: Validating JSON syntax...'));
  let valid = true;

  LOCALES.forEach(locale => {
    const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
    if (!fs.existsSync(filePath)) {
      errors.push(`Missing locale file: ${locale}.json`);
      valid = false;
      return;
    }
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      JSON.parse(content);
      console.log(chalk.green(`  ✓ ${locale}.json - Valid JSON`));
    } catch (error) {
      errors.push(`${locale}.json - Invalid JSON: ${error.message}`);
      console.log(chalk.red(`  ✗ ${locale}.json - ${error.message}`));
      valid = false;
    }
  });
  return valid;
}

// --- Phase 2: Key Parity ---

function getFlattenedKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = keys.concat(getFlattenedKeys(obj[key], prefix + key + '.'));
    } else {
      keys.push(prefix + key);
    }
  }
  return keys;
}

function validateKeyParity() {
  console.log(chalk.cyan('\n🔑 Phase 2: Validating key parity...'));

  const csPath = path.join(MESSAGES_DIR, 'cs.json');
  if (!fs.existsSync(csPath)) return;

  const csContent = JSON.parse(fs.readFileSync(csPath, 'utf8'));
  const referenceKeys = new Set(getFlattenedKeys(csContent));

  console.log(chalk.gray(`  Reference (cs.json): ${referenceKeys.size} keys`));

  LOCALES.filter(l => l !== 'cs').forEach(locale => {
    const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
    if (!fs.existsSync(filePath)) return;

    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const localeKeys = new Set(getFlattenedKeys(content));

    const missing = [...referenceKeys].filter(k => !localeKeys.has(k));
    const extra = [...localeKeys].filter(k => !referenceKeys.has(k));

    const coverage = ((localeKeys.size / referenceKeys.size) * 100).toFixed(1);

    if (missing.length > 0) {
      warnings.push(`${locale}.json - Missing ${missing.length} keys`);
      console.log(chalk.yellow(`  ⚠ ${locale}.json - ${missing.length} missing keys (${coverage}%)`));
      if (missing.length <= 5) missing.forEach(k => console.log(chalk.gray(`      - ${k}`)));
    } else {
      console.log(chalk.green(`  ✓ ${locale}.json - Complete (${coverage}%)`));
    }

    if (extra.length > 0) {
      warnings.push(`${locale}.json - ${extra.length} extra keys`);
      console.log(chalk.yellow(`  ⚠ ${locale}.json - ${extra.length} extra keys`));
    }
  });

  return referenceKeys;
}

// --- Phase 3: Hardcoded Strings (AST) ---

function getAllSourceFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getAllSourceFiles(filePath, fileList);
    } else if (/\.(tsx|ts)$/.test(file)) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function shouldIgnoreText(text) {
  return IGNORED_TEXT_CONTENT.some(regex => regex.test(text));
}

function scanHardcodedStrings() {
  console.log(chalk.cyan('\n🔎 Phase 3: Scanning for hardcoded strings (AST)...'));

  const files = getAllSourceFiles(SRC_DIR);
  let foundCount = 0;

  files.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf8');
    const sourceFile = ts.createSourceFile(
      filePath,
      content,
      ts.ScriptTarget.Latest,
      true
    );

    function visit(node) {
      // check JSX Text
      if (node.kind === ts.SyntaxKind.JsxText) {
        const text = node.getText();
        if (!shouldIgnoreText(text)) {
          // It's a non-empty text node in JSX
          reportHardcoded(filePath, node, text.trim());
        }
      }

      // check String Literals in JSX Attributes
      else if (node.kind === ts.SyntaxKind.StringLiteral) {
        if (node.parent && node.parent.kind === ts.SyntaxKind.JsxAttribute) {
          const attrName = node.parent.name.getText();
          if (CHECK_ATTRIBUTES.has(attrName)) {
            const text = node.text;
            if (!shouldIgnoreText(text)) {
              reportHardcoded(filePath, node, text);
            }
          }
        }
      }

      ts.forEachChild(node, visit);
    }

    visit(sourceFile);
  });

  function reportHardcoded(file, node, text) {
    const { line } = sourceFile = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true).getLineAndCharacterOfPosition(node.getStart());
    const relPath = path.relative(SRC_DIR, file);

    // Very simple heuristic to reduce noise: ignore if it looks like a key/code
    if (text.length < 2) return;

    console.log(chalk.yellow(`  ⚠ ${relPath}:${line + 1} - "${text}"`));
    warnings.push(`Hardcoded text in ${relPath}:${line + 1}: "${text.substring(0, 30)}..."`);
    foundCount++;
  }

  if (foundCount === 0) {
    console.log(chalk.green('  ✓ No obvious hardcoded strings found'));
  } else {
    console.log(chalk.yellow(`\n  Found ${foundCount} potential hardcoded strings`));
  }
}

// --- Phase 4: Unused Keys ---

function validateUnusedKeys(referenceKeys) {
  console.log(chalk.cyan('\n🗑️  Phase 4: Scanning for unused keys...'));

  if (!referenceKeys) return;

  const files = getAllSourceFiles(SRC_DIR);
  const allContent = files.map(f => fs.readFileSync(f, 'utf8')).join('\n'); // naive but fast enough for this size

  let unusedCount = 0;

  // We need to check flattened keys. 
  // Note: usage might be t('section.key') or t('key') if scoped.
  // This simple check looks for the exact key string in the codebase.
  // It will have false negatives (dynamic keys) but few false positives (if key is unique enough).

  referenceKeys.forEach(key => {
    const lastPart = key.split('.').pop();

    // Check allowlist
    if (UNUSED_KEYS_ALLOWLIST.some(regex => regex.test(key) || regex.test(lastPart))) {
      return;
    }

    // Check if key exists in content
    // We search for the full key "category.key" OR just "key" if it's likely used inside a scoped useTranslations
    // But searching for just "key" is risky for generic words like "title".
    // So we primarily search for the leaf key, but be careful.

    // Actually, let's search for the leaf key (last part) attached to ANY quote
    // e.g. "my_key" or 'my_key'.

    const keyRegex = new RegExp(`['"\`]${lastPart}['"\`]`);

    if (!keyRegex.test(allContent)) {
      // Double check full key just in case
      if (!allContent.includes(key)) {
        console.log(chalk.yellow(`  ⚠ Unused key: ${key}`));
        warnings.push(`Unused translation key: ${key}`);
        unusedCount++;
      }
    }
  });

  if (unusedCount === 0) {
    console.log(chalk.green('  ✓ No unused keys found'));
  } else {
    console.log(chalk.yellow(`\n  Found ${unusedCount} potentially unused keys`));
  }
}

// --- Phase 5: Interpolation ---

function validateInterpolationVariables() {
  console.log(chalk.cyan('\n🔧 Phase 5: Validating interpolation variables...'));

  const csPath = path.join(MESSAGES_DIR, 'cs.json');
  if (!fs.existsSync(csPath)) return;

  const csContent = JSON.parse(fs.readFileSync(csPath, 'utf8'));
  const refFlats = {};

  function flatt(obj, prefix = '') {
    for (const k in obj) {
      if (typeof obj[k] === 'object') flatt(obj[k], prefix + k + '.');
      else refFlats[prefix + k] = obj[k];
    }
  }
  flatt(csContent);

  const keyVars = {};
  Object.keys(refFlats).forEach(k => {
    const matches = refFlats[k].match(/{[^}]+}/g);
    if (matches) keyVars[k] = matches.sort();
  });

  LOCALES.filter(l => l !== 'cs').forEach(locale => {
    const p = path.join(MESSAGES_DIR, `${locale}.json`);
    if (!fs.existsSync(p)) return;

    const content = JSON.parse(fs.readFileSync(p, 'utf8'));
    const locFlats = {};
    function flattLoc(obj, pfx = '') {
      for (const k in obj) {
        if (typeof obj[k] === 'object') flattLoc(obj[k], pfx + k + '.');
        else locFlats[pfx + k] = obj[k];
      }
    }
    flattLoc(content);

    let issues = 0;
    Object.keys(keyVars).forEach(k => {
      if (!locFlats[k]) return;
      const m = (locFlats[k].match(/{[^}]+}/g) || []).sort();
      if (JSON.stringify(m) !== JSON.stringify(keyVars[k])) {
        console.log(chalk.yellow(`  ⚠ ${locale}.json - ${k}`));
        console.log(chalk.gray(`      Ref: ${keyVars[k].join(', ')}`));
        console.log(chalk.gray(`      Loc: ${m.join(', ')}`));
        warnings.push(`${locale}.json - Interpolation mismatch: ${k}`);
        issues++;
      }
    });
    if (issues === 0) console.log(chalk.green(`  ✓ ${locale}.json - Interpolation OK`));
  });
}

// --- Runner ---

if (validateJsonSyntax()) {
  const refKeys = validateKeyParity();
  scanHardcodedStrings();
  validateUnusedKeys(refKeys);
  validateInterpolationVariables();
}

console.log(chalk.blue.bold('\n📊 Summary'));
if (errors.length > 0) {
  console.log(chalk.red(`${errors.length} Errors`));
  process.exit(1);
}
if (warnings.length > 0) {
  console.log(chalk.yellow(`${warnings.length} Warnings`));
  // We generally don't fail build on warnings, but in strict mode we might.
  // For now, exit 0.
}
console.log(chalk.green('Done.'));
process.exit(0);

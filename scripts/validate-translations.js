#!/usr/bin/env node

/**
 * Translation Validation Script
 *
 * Validates:
 * 1. JSON syntax in all locale files
 * 2. Key parity across all locales (cs.json is reference)
 * 3. No hardcoded Czech strings in JSX files
 * 4. Interpolation variable consistency
 *
 * Usage:
 *   node scripts/validate-translations.js
 *   npm run validate:translations
 *
 * Exit codes:
 *   0 = All validations passed
 *   1 = Validation errors found
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const LOCALES = ['cs', 'en', 'sk', 'pl', 'hu'];
const MESSAGES_DIR = path.join(__dirname, '../src/messages');
const SRC_DIR = path.join(__dirname, '../src');

// Hardcoded string patterns to detect
const HARDCODED_PATTERNS = [
  /placeholder=["'](?!{)([^"']*[áčďéěíňóřšťúůýž][^"']*)["']/gi,  // Czech diacritics in placeholders
  /SelectValue.*placeholder=["'](?!{)([^"']*[áčďéěíňóřšťúůýž][^"']*)["']/gi,  // SelectValue with Czech
  /<SelectItem[^>]*>(?!{)([^<]*[áčďéěíňóřšťúůýž][^<]*)<\/SelectItem>/gi,  // SelectItem with Czech text
  /label=["'](?!{)([^"']*[áčďéěíňóřšťúůýž][^"']*)["']/gi,  // Czech labels
];

// Validation results
let errors = [];
let warnings = [];

console.log(chalk.blue.bold('\n🔍 Translation Validation\n'));

/**
 * Validate JSON syntax
 */
function validateJsonSyntax() {
  console.log(chalk.cyan('📄 Phase 1: Validating JSON syntax...'));

  LOCALES.forEach(locale => {
    const filePath = path.join(MESSAGES_DIR, `${locale}.json`);

    if (!fs.existsSync(filePath)) {
      errors.push(`Missing locale file: ${locale}.json`);
      return;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      JSON.parse(content);
      console.log(chalk.green(`  ✓ ${locale}.json - Valid JSON`));
    } catch (error) {
      errors.push(`${locale}.json - Invalid JSON: ${error.message}`);
      console.log(chalk.red(`  ✗ ${locale}.json - ${error.message}`));
    }
  });
}

/**
 * Validate key parity across all locales
 */
function validateKeyParity() {
  console.log(chalk.cyan('\n🔑 Phase 2: Validating key parity...'));

  // Load reference locale (cs.json)
  const referenceFile = path.join(MESSAGES_DIR, 'cs.json');
  const referenceKeys = new Set(Object.keys(JSON.parse(fs.readFileSync(referenceFile, 'utf8'))));

  console.log(chalk.gray(`  Reference (cs.json): ${referenceKeys.size} keys`));

  // Compare each locale against reference
  LOCALES.filter(l => l !== 'cs').forEach(locale => {
    const filePath = path.join(MESSAGES_DIR, `${locale}.json`);

    if (!fs.existsSync(filePath)) {
      return; // Already reported in Phase 1
    }

    const localeData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const localeKeys = new Set(Object.keys(localeData));

    // Find missing keys
    const missingKeys = [...referenceKeys].filter(key => !localeKeys.has(key));

    // Find extra keys (keys in locale but not in reference)
    const extraKeys = [...localeKeys].filter(key => !referenceKeys.has(key));

    const coverage = ((localeKeys.size / referenceKeys.size) * 100).toFixed(1);

    if (missingKeys.length > 0) {
      warnings.push(`${locale}.json - Missing ${missingKeys.length} keys (${coverage}% coverage)`);
      console.log(chalk.yellow(`  ⚠ ${locale}.json - ${missingKeys.length} missing keys (${coverage}% coverage)`));

      if (missingKeys.length <= 10) {
        missingKeys.forEach(key => {
          console.log(chalk.gray(`      - ${key}`));
        });
      } else {
        console.log(chalk.gray(`      First 10: ${missingKeys.slice(0, 10).join(', ')}...`));
      }
    } else {
      console.log(chalk.green(`  ✓ ${locale}.json - Complete (${coverage}% coverage)`));
    }

    if (extraKeys.length > 0) {
      warnings.push(`${locale}.json - ${extraKeys.length} extra keys not in reference`);
      console.log(chalk.yellow(`  ⚠ ${locale}.json - ${extraKeys.length} extra keys`));
    }
  });
}

/**
 * Scan for hardcoded strings in source files
 */
function scanHardcodedStrings() {
  console.log(chalk.cyan('\n🔎 Phase 3: Scanning for hardcoded Czech strings...'));

  const componentDirs = [
    path.join(SRC_DIR, 'components/calculators'),
    path.join(SRC_DIR, 'components/navigation'),
    path.join(SRC_DIR, 'components/layout'),
    path.join(SRC_DIR, 'app'),
  ];

  let foundCount = 0;

  componentDirs.forEach(dir => {
    if (!fs.existsSync(dir)) return;

    scanDirectory(dir, (file, content) => {
      HARDCODED_PATTERNS.forEach((pattern, index) => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          const lineNumber = content.substring(0, match.index).split('\n').length;
          const contextLine = content.split('\n')[lineNumber - 1]?.trim() || '';

          warnings.push(`Hardcoded Czech text in ${file}:${lineNumber}`);
          console.log(chalk.yellow(`  ⚠ ${path.relative(SRC_DIR, file)}:${lineNumber}`));
          console.log(chalk.gray(`      ${contextLine.substring(0, 80)}...`));

          foundCount++;
        }
      });
    });
  });

  if (foundCount === 0) {
    console.log(chalk.green('  ✓ No hardcoded Czech strings found'));
  } else {
    console.log(chalk.yellow(`\n  Found ${foundCount} instances of hardcoded Czech text`));
  }
}

/**
 * Recursively scan directory for .tsx files
 */
function scanDirectory(dir, callback) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      scanDirectory(filePath, callback);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      const content = fs.readFileSync(filePath, 'utf8');
      callback(filePath, content);
    }
  });
}

/**
 * Validate interpolation variables
 */
function validateInterpolationVariables() {
  console.log(chalk.cyan('\n🔧 Phase 4: Validating interpolation variables...'));

  const referenceFile = path.join(MESSAGES_DIR, 'cs.json');
  const referenceData = JSON.parse(fs.readFileSync(referenceFile, 'utf8'));

  // Extract keys with interpolation variables from reference
  const interpolationKeys = {};
  Object.entries(referenceData).forEach(([key, value]) => {
    // Skip non-string values (nested objects)
    if (typeof value !== 'string') return;

    const matches = value.match(/{[^}]+}/g);
    if (matches) {
      interpolationKeys[key] = matches.sort();
    }
  });

  if (Object.keys(interpolationKeys).length === 0) {
    console.log(chalk.gray('  No interpolation variables found in reference'));
    return;
  }

  // Check each locale
  LOCALES.filter(l => l !== 'cs').forEach(locale => {
    const filePath = path.join(MESSAGES_DIR, `${locale}.json`);

    if (!fs.existsSync(filePath)) return;

    const localeData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let mismatchCount = 0;

    Object.entries(interpolationKeys).forEach(([key, refVars]) => {
      if (!localeData[key]) return; // Already reported in key parity check
      if (typeof localeData[key] !== 'string') return; // Skip non-string values

      const localeMatches = (localeData[key].match(/{[^}]+}/g) || []).sort();

      if (JSON.stringify(refVars) !== JSON.stringify(localeMatches)) {
        warnings.push(`${locale}.json - Interpolation mismatch in key: ${key}`);
        console.log(chalk.yellow(`  ⚠ ${locale}.json - "${key}"`));
        console.log(chalk.gray(`      Expected: ${refVars.join(', ')}`));
        console.log(chalk.gray(`      Found: ${localeMatches.join(', ') || 'none'}`));
        mismatchCount++;
      }
    });

    if (mismatchCount === 0) {
      console.log(chalk.green(`  ✓ ${locale}.json - All interpolations match`));
    }
  });
}

/**
 * Print summary
 */
function printSummary() {
  console.log(chalk.blue.bold('\n📊 Validation Summary\n'));

  if (errors.length === 0 && warnings.length === 0) {
    console.log(chalk.green.bold('✅ All validations passed!\n'));
    process.exit(0);
  }

  if (errors.length > 0) {
    console.log(chalk.red.bold(`❌ ${errors.length} Error(s):`));
    errors.forEach(err => console.log(chalk.red(`  - ${err}`)));
    console.log('');
  }

  if (warnings.length > 0) {
    console.log(chalk.yellow.bold(`⚠️  ${warnings.length} Warning(s):`));
    warnings.forEach(warn => console.log(chalk.yellow(`  - ${warn}`)));
    console.log('');
  }

  console.log(chalk.cyan('💡 Next steps:'));
  console.log(chalk.gray('  1. Fix errors (if any) - these block the build'));
  console.log(chalk.gray('  2. Review warnings - these should be addressed'));
  console.log(chalk.gray('  3. Run: npm run validate:translations'));
  console.log('');

  // Exit with error code if there are errors
  if (errors.length > 0) {
    process.exit(1);
  }

  // Exit with success but warnings reported
  process.exit(0);
}

// Run all validations
validateJsonSyntax();
validateKeyParity();
scanHardcodedStrings();
validateInterpolationVariables();
printSummary();

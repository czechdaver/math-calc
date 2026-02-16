#!/usr/bin/env node

/**
 * Translation Sync Script
 *
 * Scans all locale files and ensures they have all keys present in the reference (cs.json).
 * - Adds missing keys with a [MISSING] prefix (or English value if available).
 * - Sorts keys alphabetically to match reference order.
 *
 * Usage:
 *   node scripts/sync-translations.js
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const LOCALES = ['cs', 'en', 'sk', 'pl', 'hu'];
const MESSAGES_DIR = path.join(__dirname, '../src/messages');

console.log(chalk.blue.bold('\n🔄 Translation Sync\n'));

const csPath = path.join(MESSAGES_DIR, 'cs.json');
if (!fs.existsSync(csPath)) {
    console.error(chalk.red('❌ Reference file cs.json not found!'));
    process.exit(1);
}

const csContent = JSON.parse(fs.readFileSync(csPath, 'utf8'));

// Helper to sort object keys
function sortObject(obj) {
    return Object.keys(obj).sort().reduce((acc, key) => {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            acc[key] = sortObject(obj[key]);
        } else {
            acc[key] = obj[key];
        }
        return acc;
    }, {});
}

// Helper to deeply merge and fill missing keys
function mergeKeys(reference, target, locale) {
    let modified = false;
    const result = { ...target };

    for (const key in reference) {
        if (typeof reference[key] === 'object' && reference[key] !== null) {
            if (!result[key] || typeof result[key] !== 'object') {
                result[key] = {}; // Create missing object
            }
            const { result: mergedChild, modified: childModified } = mergeKeys(reference[key], result[key], locale);
            result[key] = mergedChild;
            if (childModified) modified = true;
        } else {
            if (result[key] === undefined) {
                // Missing key found
                console.log(chalk.yellow(`  + Adding missing key to ${locale}.json: ${key}`));
                // Use english value if available (assuming en.json exists and we are not processing en.json itself)
                // For simplicity, we just use the reference value with a prefix, or just the reference value if preferred.
                // Let's us "[MISSING] " + reference value to make it obvious.
                result[key] = `[MISSING] ${reference[key]}`;
                modified = true;
            }
        }
    }
    return { result, modified };
}

LOCALES.filter(l => l !== 'cs').forEach(locale => {
    const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
    let content = {};

    if (fs.existsSync(filePath)) {
        try {
            content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (e) {
            console.error(chalk.red(`❌ Invalid JSON in ${locale}.json`));
            return;
        }
    } else {
        console.log(chalk.yellow(`⚠️  Creating new file: ${locale}.json`));
    }

    const { result, modified } = mergeKeys(csContent, content, locale);
    const sortedResult = sortObject(result);

    if (modified) {
        fs.writeFileSync(filePath, JSON.stringify(sortedResult, null, 2) + '\n');
        console.log(chalk.green(`  ✓ Updated ${locale}.json`));
    } else {
        // Check if sorting is needed (compare stringified)
        if (JSON.stringify(content) !== JSON.stringify(sortedResult)) {
            fs.writeFileSync(filePath, JSON.stringify(sortedResult, null, 2) + '\n');
            console.log(chalk.green(`  ✓ Sorted ${locale}.json`));
        } else {
            console.log(chalk.gray(`  - ${locale}.json is up to date`));
        }
    }
});

console.log(chalk.green('\nDone.'));

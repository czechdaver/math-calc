
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const MESSAGES_DIR = path.join(__dirname, '../src/messages');
const SRC_DIR = path.join(__dirname, '../src');
const LOCALES = ['cs', 'en', 'sk', 'pl', 'hu'];

// Copy of ALLOWLIST from validate-translations.js
const UNUSED_KEYS_ALLOWLIST = [
    /^metadata_/,
    /^seo_/,
    /^category_/,
    /^calculators\./,
    /_description$/,
    /_title$/,
    /_keywords$/,
];

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

function deleteKey(obj, keyPath) {
    const parts = keyPath.split('.');
    let current = obj;
    for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) return;
        current = current[parts[i]];
    }
    const lastPart = parts[parts.length - 1];
    if (current[lastPart] !== undefined) {
        delete current[lastPart];
        // Clean up empty objects? Maybe not strictly necessary but nice.
        // Not implementing recursive cleanup for now to avoid accidental deletions of parent nodes that might have other children.
        return true;
    }
    return false;
}

function main() {
    console.log('Scanning for unused keys...');

    const csPath = path.join(MESSAGES_DIR, 'cs.json');
    if (!fs.existsSync(csPath)) {
        console.error('cs.json not found');
        process.exit(1);
    }

    const csContent = JSON.parse(fs.readFileSync(csPath, 'utf8'));
    const referenceKeys = getFlattenedKeys(csContent);

    const files = getAllSourceFiles(SRC_DIR);
    // Also check test files? Yes, tests use keys.
    // We already include all tsx/ts in src, which includes test/page.tsx.

    const allContent = files.map(f => fs.readFileSync(f, 'utf8')).join('\n');

    const keysToRemove = [];

    referenceKeys.forEach(key => {
        const lastPart = key.split('.').pop();
        if (UNUSED_KEYS_ALLOWLIST.some(regex => regex.test(key) || regex.test(lastPart))) {
            return;
        }

        const keyRegex = new RegExp(`['"\`]${lastPart}['"\`]`);
        if (!keyRegex.test(allContent) && !allContent.includes(key)) {
            keysToRemove.push(key);
        }
    });

    if (keysToRemove.length === 0) {
        console.log('No unused keys found.');
        return;
    }

    console.log(`Found ${keysToRemove.length} unused keys. Removing...`);
    keysToRemove.forEach(k => console.log(` - ${k}`));

    LOCALES.forEach(locale => {
        const p = path.join(MESSAGES_DIR, `${locale}.json`);
        if (fs.existsSync(p)) {
            const content = JSON.parse(fs.readFileSync(p, 'utf8'));
            let removedCount = 0;
            keysToRemove.forEach(key => {
                if (deleteKey(content, key)) removedCount++;
            });
            if (removedCount > 0) {
                console.log(`Removed ${removedCount} keys from ${locale}.json`);
                fs.writeFileSync(p, JSON.stringify(content, null, 2) + '\n');
            }
        }
    });

    console.log('Done.');
}

main();


const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/messages/hu.json');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix the Footer and Homepage structure
// The file has a truncated footer at line ~1479 and then indented ideal_weight keys.
// We will look for the pattern and replace it.

const footerStart = '  "footer": {';
const badPoint = '      "privacy": "Adatvédelem",\n      "ideal_weight_category": "Egészség",';

// Correct footer content
const correctFooter = `  "footer": {
    "about": {
      "title": "Cég",
      "company": "Rólunk",
      "team": "Csapat",
      "careers": "Karrier",
      "blog": "Blog"
    },
    "support": {
      "title": "Támogatás",
      "help_center": "Súgóközpont",
      "contact": "Kapcsolat",
      "faq": "GYIK"
    },
    "legal": {
      "title": "Jogi",
      "terms": "Felhasználási feltételek",
      "privacy": "Adatvédelem",
      "cookies": "Süti szabályzat"
    },
    "resources": {
      "title": "Források",
      "documentation": "Dokumentáció",
      "api": "API",
      "status": "Rendszerállapot"
    },
    "rights": "Minden jog fenntartva",
    "made_with": "Készült",
    "in": "itt:",
    "version": "Verzió",
    "terms": "Feltételek",
    "privacy": "Adatvédelem",
    "cookies": "Sütik"
  },`;

// Missing ideal_weight keys (English placeholders if needed)
const missingIdealWeight = `  "ideal_weight_age_error": "Zadejte platný életkor (15-120 let)",
  "ideal_weight_age_help": "Váš életkor v letech",
  "ideal_weight_age_label": "Életkor",
  "ideal_weight_calculator_description": "Számítsd ki az ideális testsúlyt",
  "ideal_weight_calculator_title": "Ideális Testsúly Kalkulátor",`;

// We need to replace the bad footer and inject missing keys.
// But first, let's just write the file with valid JSON structure if possible, or string manipulation.
// The file is currently invalid, so we rely on string replacement.

// Find where footer starts
const startIdx = content.indexOf(footerStart);
if (startIdx === -1) {
    console.error("Footer start not found");
    process.exit(1);
}

// Find where "ideal_weight_category" starts
const problemKey = '"ideal_weight_category": "Egészség"';
const problemIdx = content.indexOf(problemKey);
if (problemIdx === -1) {
    console.error("Problem key not found");
    process.exit(1);
}

// The replacement should go from startIdx up to problemIdx (excluding problemKey itself, but we need to handle the comma/newline before it)
// basic approach: take content up to startIdx, append correctFooter + missingIdealWeight, then take content from problemIdx to end.
// AND we need to fix indentation of the content from problemIdx onwards.

const before = content.substring(0, startIdx);
const after = content.substring(problemIdx);

// Fix indentation in 'after'
// It currently has 6 spaces? "      "ideal_weight_category": "Egészség","
// We want 2 spaces.
// Regex to replace 6 spaces with 2 spaces at start of lines?
// Be careful not to break nested objects if any.
// Most ideal_weight keys are top level.

let fixedAfter = after.replace(/^\s{6}"/gm, '  "');

// Combine
const newContent = before + correctFooter + '\n' + missingIdealWeight + '\n' + fixedAfter;

fs.writeFileSync(filePath, newContent, 'utf8');
console.log("Fixed hu.json");

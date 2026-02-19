
const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = path.join(__dirname, '../src/messages');
const LOCALES = ['cs', 'en', 'sk', 'pl', 'hu'];

// Keys associated with LaTeX formulas or static text containing braces that should NOT be interpolated
const KEYS_TO_ESCAPE = [
    'bmi_formula',
    'calculators.fuel.formula.latex',
    'ideal_weight_latex',
    'procento_z_cisla_formula',
    'vat_formula_base_to_total',
    'vat_formula_total_to_base',
    'calculators.calories.formula.latex',
    'calculators.discount.formula.latex',
    'calculators.roi.formula.latex',
    'calculators.loan.formula.latex',
    'calculators.currency.formula.latex',
    'calculators.compound_interest.formula.latex',
    'calculators.concrete.formula.latex',
    'calculators.percentage.formula.latex',
    'calculators.bmi.formula.latex',
    'currency_formula_latex',
    'tip_formula_latex',
    'area_formula_latex',
    // Add any other keys found via grep
    'neprima_umera_formula',
    'prima_umera_formula',
    'kolik_procent_je_x_z_y_formula'
];

function escapeBraces(text) {
    if (!text) return text;
    // Replace { with '{ and } with }'
    // But be careful not to double escape if already escaped
    return text.replace(/(?<!'){/g, "'{").replace(/(?<!'})}/g, "}'");
}

function processObject(obj, prefix = '') {
    for (const key in obj) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            processObject(obj[key], fullKey);
        } else if (typeof obj[key] === 'string') {
            // Check if this key is in our list OR ends with .latex or _formula
            if (KEYS_TO_ESCAPE.includes(fullKey) || fullKey.endsWith('.latex') || fullKey.endsWith('_formula') || fullKey.endsWith('_formula_desc')) {
                if (obj[key].includes('{') || obj[key].includes('}')) {
                    // Only escape if it looks like a formula (contains braces) AND is not a known interpolation key
                    // Optimization: Just escape it.
                    const escaped = escapeBraces(obj[key]);
                    if (escaped !== obj[key]) {
                        console.log(`Escaping ${fullKey}`);
                        obj[key] = escaped;
                    }
                }
            }
        }
    }
}

LOCALES.forEach(locale => {
    const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
    if (fs.existsSync(filePath)) {
        console.log(`Processing ${locale}.json...`);
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        processObject(content);
        fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n');
    }
});

console.log('Done.');

const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = path.join(__dirname, '../src/messages');
const LOCALES = ['cs', 'en', 'sk', 'pl', 'hu'];

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
    'neprima_umera_formula',
    'prima_umera_formula',
    'kolik_procent_je_x_z_y_formula'
];

function isFormulaKey(key) {
    return KEYS_TO_ESCAPE.includes(key) || key.endsWith('.latex') || key.endsWith('_formula') || key.endsWith('_formula_desc') || key.endsWith('_formula_latex');
}

function processObject(obj, prefix = '') {
    for (const key in obj) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            processObject(obj[key], fullKey);
        } else if (typeof obj[key] === 'string') {
            if (isFormulaKey(fullKey)) {
                let text = obj[key];

                // 1) Strip out any existing weird quotes around braces
                // e.g. '{', '}', }', '{, ''{'' 
                text = text.replace(/'*\{'*/g, '{').replace(/'*\}'*/g, '}');

                // 2) If it doesn't even have braces anymore, just leave it as is
                if (!text.includes('{') && !text.includes('}')) {
                    if (text !== obj[key]) {
                        console.log(`Cleaned unneeded quotes: ${fullKey}`);
                        obj[key] = text;
                    }
                    continue;
                }

                // 3) Wrap braces with spaces and exactly one set of quotes: ` '{' ` and ` '}' `
                // This prevents adjacent quotes '' which ICU parses as a single literal quote.
                // We use space around them. Then we collapse any resulting multiple spaces.
                text = text.replace(/\{/g, " '{' ").replace(/\}/g, " '}' ");
                text = text.replace(/\s+/g, ' '); // Collapse multiple spaces

                // Trim trailing/leading space if created
                text = text.trim();

                if (text !== obj[key]) {
                    console.log(`Fixed: ${fullKey}`);
                    // console.log(`  Before: ${obj[key]}`);
                    // console.log(`  After : ${text}`);
                    obj[key] = text;
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
console.log('Done');

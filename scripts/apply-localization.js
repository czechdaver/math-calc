#!/usr/bin/env node

/**
 * Script to systematically apply localization to all calculators
 * Replaces hardcoded Czech texts with localization keys
 */

const fs = require('fs');
const path = require('path');

// Common hardcoded texts to replace with localization keys
const commonReplacements = {
  // Layout props
  'title: "Kalkulátor': 'title: t(\'calculators.',
  'description: "Vypočítejte': 'description: t(\'calculators.',
  'category: "Praktické"': 'category: t(\'categories.practical\')',
  'category: "Finanční"': 'category: t(\'categories.financial\')',
  'category: "Stavební"': 'category: t(\'categories.construction\')',
  'category: "Zdraví"': 'category: t(\'categories.health\')',
  
  // Common UI elements
  'title: "Vzorec"': 'title: t(\'common.formula\')',
  'title: "Kalkulačka"': 'title: t(\'common.calculator\')',
  'title: "Výsledek"': 'title: t(\'common.result\')',
  'title: "Příklady': 'title: t(\'common.examples\')',
  'title: "Často kladené otázky"': 'title: t(\'common.faq\')',
  'title: "Související kalkulátory"': 'title: t(\'common.related_calculators\')',
  '"Zadejte hodnoty pro výpočet"': 't(\'common.enter_values\')',
  '"Kč"': 't(\'common.currency\')',
  '"%"': 't(\'common.percentage\')',
  '"let"': 't(\'common.years\')',
  '"měsíců"': 't(\'common.months\')',
  '"dní"': 't(\'common.days\')',
  '"hodin"': 't(\'common.hours\')',
  '"minut"': 't(\'common.minutes\')',
};

// Calculator-specific replacements
const calculatorReplacements = {
  'TipCalculator.tsx': {
    '"Částka účtu"': 't(\'calculators.tip.bill_amount\')',
    '"Kvalita obsluhy"': 't(\'calculators.tip.service_quality\')',
    '"Počet lidí"': 't(\'calculators.tip.number_of_people\')',
    '"osob"': 't(\'calculators.tip.people_unit\')',
    '"Celkem k zaplacení"': 't(\'calculators.tip.total_to_pay\')',
    '"Účet + spropitné"': 't(\'calculators.tip.bill_plus_tip\')',
    '"Účet"': 't(\'calculators.tip.original_bill\')',
    '"Spropitné"': 't(\'calculators.tip.tip_amount\')',
    '"Na osobu"': 't(\'calculators.tip.per_person\')',
    '"Špatná (10%)"': 't(\'calculators.tip.service_poor\')',
    '"Dobrá (15%)"': 't(\'calculators.tip.service_good\')',
    '"Výborná (20%)"': 't(\'calculators.tip.service_excellent\')',
    '"Vlastní"': 't(\'calculators.tip.service_custom\')',
  },
  'AgeCalculator.tsx': {
    '"Datum narození"': 't(\'calculators.age.birth_date\')',
    '"Cílové datum"': 't(\'calculators.age.target_date\')',
    '"Rychlé nastavení"': 't(\'calculators.age.quick_settings\')',
    '"Dnes"': 't(\'calculators.age.today\')',
    '"Za rok"': 't(\'calculators.age.next_year\')',
    '"Přesný věk"': 't(\'calculators.age.exact_age\')',
    '"Celkem"': 't(\'calculators.age.total\')',
    '"Další narozeniny"': 't(\'calculators.age.next_birthday\')',
    '"Datum"': 't(\'calculators.age.date\')',
    '"Věk"': 't(\'calculators.age.age_will_be\')',
    '"Znamení zvěrokruhu"': 't(\'calculators.age.zodiac_sign\')',
  },
  'CurrencyCalculator.tsx': {
    '"Částka"': 't(\'calculators.currency.amount\')',
    '"Rychlé částky"': 't(\'calculators.currency.quick_amounts\')',
    '"Z měny"': 't(\'calculators.currency.from_currency\')',
    '"Na měnu"': 't(\'calculators.currency.to_currency\')',
    '"Prohodit měny"': 't(\'calculators.currency.swap_currencies\')',
    '"Převedená částka"': 't(\'calculators.currency.converted_amount\')',
    '"Směnný kurz"': 't(\'calculators.currency.exchange_rate\')',
    '"Aktuální kurz"': 't(\'calculators.currency.current_rate\')',
    '"Původní částka"': 't(\'calculators.currency.original_amount\')',
    '"Oblíbené převody"': 't(\'calculators.currency.popular_conversions\')',
  },
  'MaterialCalculator.tsx': {
    '"Typ materiálu"': 't(\'calculators.material.material_type\')',
    '"Plocha"': 't(\'calculators.material.area\')',
    '"Cena za"': 't(\'calculators.material.price_per_unit\')',
    '"Odpad/rezerva"': 't(\'calculators.material.waste_reserve\')',
    '"Doporučeno"': 't(\'calculators.material.recommended\')',
    '"Potřebné množství"': 't(\'calculators.material.required_amount\')',
    '"Základní množství"': 't(\'calculators.material.basic_amount\')',
    '"Celková cena"': 't(\'calculators.material.total_price\')',
  },
  'IRRCalculator.tsx': {
    '"Diskontní sazba"': 't(\'calculators.irr.discount_rate\')',
    '"Peněžní toky"': 't(\'calculators.irr.cash_flows\')',
    '"Přidat období"': 't(\'calculators.irr.add_period\')',
    '"Počátek"': 't(\'calculators.irr.beginning\')',
    '"Rok"': 't(\'calculators.irr.year\')',
    '"Vnitřní výnosové procento (IRR)"': 't(\'calculators.irr.irr_result\')',
    '"Investice je výhodná"': 't(\'calculators.irr.investment_profitable\')',
    '"Čistá současná hodnota (NPV)"': 't(\'calculators.irr.npv_result\')',
    '"Doba návratnosti"': 't(\'calculators.irr.payback_period\')',
    '"Čistý zisk"': 't(\'calculators.irr.net_profit\')',
    '"Celková investice"': 't(\'calculators.irr.total_investment\')',
    '"Celkové výnosy"': 't(\'calculators.irr.total_returns\')',
  }
};

function applyLocalizationToFile(filePath, fileName) {
  console.log(`Processing ${fileName}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Apply common replacements
  for (const [search, replace] of Object.entries(commonReplacements)) {
    if (content.includes(search)) {
      content = content.replace(new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replace);
      modified = true;
    }
  }

  // Apply calculator-specific replacements
  if (calculatorReplacements[fileName]) {
    for (const [search, replace] of Object.entries(calculatorReplacements[fileName])) {
      if (content.includes(search)) {
        content = content.replace(new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replace);
        modified = true;
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated ${fileName}`);
  } else {
    console.log(`⏭️  No changes needed for ${fileName}`);
  }
}

function main() {
  const calculatorsDir = path.join(__dirname, '../src/components/calculators');
  
  if (!fs.existsSync(calculatorsDir)) {
    console.error('❌ Calculators directory not found:', calculatorsDir);
    process.exit(1);
  }

  const files = fs.readdirSync(calculatorsDir)
    .filter(file => file.endsWith('.tsx'))
    .filter(file => !file.includes('Refactored')); // Skip old refactored files

  console.log(`🚀 Starting localization migration for ${files.length} calculators...\n`);

  files.forEach(fileName => {
    const filePath = path.join(calculatorsDir, fileName);
    applyLocalizationToFile(filePath, fileName);
  });

  console.log('\n✅ Localization migration completed!');
  console.log('📝 Next steps:');
  console.log('1. Test all calculators in both CS and EN locales');
  console.log('2. Add missing localization keys if needed');
  console.log('3. Verify all hardcoded texts are replaced');
}

if (require.main === module) {
  main();
}

module.exports = { applyLocalizationToFile, commonReplacements, calculatorReplacements };

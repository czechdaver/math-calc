#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Map of old import paths to new ones
const IMPORT_MAP = {
  // Old path: New path
  '@/components/calculators/AnuitniSplatkaCalculator.refactored': '@/components/calculators/AnnuityPaymentCalculator',
  '@/components/calculators/BMICalculator.refactored': '@/components/calculators/BMICalculator',
  '@/components/calculators/CistaMzdaCalculator.refactored': '@/components/calculators/NetSalaryCalculator',
  '@/components/calculators/CompoundInterestCalculator.refactored': '@/components/calculators/CompoundInterestCalculator',
  '@/components/calculators/DPHCalculator.refactored': '@/components/calculators/VATCalculator',
  '@/components/calculators/KolikProcentJeXZYCalculator.refactored': '@/components/calculators/WhatPercentageIsXOfYCalculator',
  '@/components/calculators/NeprimaUmeraCalculator.refactored': '@/components/calculators/InverseProportionCalculator',
  '@/components/calculators/PrimaUmeraCalculator.refactored': '@/components/calculators/DirectProportionCalculator',
  '@/components/calculators/ProcentoZCislaCalculator.refactored': '@/components/calculators/PercentageOfNumberCalculator',
  '@/components/calculators/UnitConverter.refactored': '@/components/calculators/UnitConverter',
  '@/components/calculators/YJeXKolikJeStoCalculator.refactored': '@/components/calculators/YIsXWhatIsHundredCalculator',
  '@/components/calculators/ZlomkyCalculator.refactored': '@/components/calculators/FractionsCalculator',
};

// Find all page files that might contain dynamic imports
function findPageFiles() {
  const pagesDir = path.join(process.cwd(), 'src/app');
  const pageFiles = [];
  
  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Skip node_modules and other non-page directories
        if (!['node_modules', '.next', '.git', '__tests__', 'test', 'tests', 'mocks', 'fixtures'].includes(entry.name)) {
          walk(fullPath);
        }
      } else if (entry.isFile() && (entry.name === 'page.tsx' || entry.name === 'page.js')) {
        pageFiles.push(fullPath);
      }
    }
  }
  
  walk(pagesDir);
  return pageFiles;
}

// Update imports in a file
function updateImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  for (const [oldImport, newImport] of Object.entries(IMPORT_MAP)) {
    if (content.includes(oldImport)) {
      content = content.replace(new RegExp(oldImport, 'g'), newImport);
      updated = true;
      console.log(`  ↳ Updated import: ${oldImport} -> ${newImport}`);
    }
  }
  
  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  
  return false;
}

// Main function
function main() {
  console.log('🔍 Finding page files with dynamic imports...\n');
  
  const pageFiles = findPageFiles();
  console.log(`Found ${pageFiles.length} page files to check\n`);
  
  let updatedCount = 0;
  
  for (const file of pageFiles) {
    console.log(`Checking: ${file}`);
    const wasUpdated = updateImportsInFile(file);
    
    if (wasUpdated) {
      updatedCount++;
    }
  }
  
  console.log('\n📊 Update Summary:');
  console.log(`- Total files checked: ${pageFiles.length}`);
  console.log(`- Files updated: ${updatedCount}`);
  
  if (updatedCount > 0) {
    console.log('\n✅ Imports updated successfully!');
  } else {
    console.log('\nℹ️  No files needed updating.');
  }
}

// Run the script
main();

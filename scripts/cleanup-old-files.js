#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// List of old calculator files to remove
const OLD_CALCULATOR_FILES = [
  'src/components/calculators/AnuitniSplatkaCalculator.tsx',
  'src/components/calculators/BMICalculator.tsx',
  'src/components/calculators/CistaMzdaCalculator.tsx',
  'src/components/calculators/CompoundInterestCalculator.tsx',
  'src/components/calculators/DPHCalculator.tsx',
  'src/components/calculators/KolikProcentJeXZYCalculator.tsx',
  'src/components/calculators/NeprimaUmeraCalculator.tsx',
  'src/components/calculators/PrimaUmeraCalculator.tsx',
  'src/components/calculators/ProcentoZCislaCalculator.tsx',
  'src/components/calculators/UnitConverter.tsx',
  'src/components/calculators/YJeXKolikJeStoCalculator.tsx',
  'src/components/calculators/ZlomkyCalculator.tsx',
  'src/components/calculators/fractionOperations/FractionOperations.tsx',
  'src/components/calculators/fractionOperations/FractionAddition.tsx',
  'src/components/calculators/fractionOperations/FractionSubtraction.tsx',
  'src/components/calculators/fractionOperations/FractionMultiplication.tsx',
  'src/components/calculators/fractionOperations/FractionDivision.tsx',
  'src/components/calculators/fractionOperations/FractionSimplification.tsx',
  'src/components/calculators/fractionOperations/FractionConversion.tsx',
];

// Function to safely remove files
function removeFiles() {
  console.log('Starting cleanup of old calculator files...');
  let removedCount = 0;
  let errorCount = 0;

  OLD_CALCULATOR_FILES.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath);
    
    try {
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log(`✅ Removed: ${filePath}`);
        removedCount++;
      } else {
        console.log(`ℹ️  Not found (skipping): ${filePath}`);
      }
    } catch (error) {
      console.error(`❌ Error removing ${filePath}:`, error.message);
      errorCount++;
    }
  });

  console.log('\nCleanup summary:');
  console.log(`- Files removed: ${removedCount}`);
  console.log(`- Errors: ${errorCount}`);
  
  if (errorCount > 0) {
    console.log('\n⚠️  Some files could not be removed. Please check the errors above.');
  } else {
    console.log('\n✅ Cleanup completed successfully!');
  }
}

// Run the cleanup
removeFiles();

#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Map of old file names to new English names
const FILE_MAP = {
  // Czech to English translations
  'AnuitniSplatka': 'AnnuityPayment',
  'CistaMzda': 'NetSalary',
  'YJeXKolikJeSto': 'YIsXWhatIsHundred',
  'NeprimaUmera': 'InverseProportion',
  'PrimaUmera': 'DirectProportion',
  'ProcentoZCisla': 'PercentageOfNumber',
  'KolikProcentJeXZY': 'WhatPercentageIsXOfY',
  'Zlomky': 'Fractions',
  'DPH': 'VAT',
  'BMI': 'BMI',
  'UnitConverter': 'UnitConverter',
  'CompoundInterest': 'CompoundInterest'
};

// Find all .refactored.tsx files
function findRefactoredFiles() {
  const srcDir = path.join(process.cwd(), 'src');
  const files = [];
  
  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.refactored.tsx')) {
        files.push(fullPath);
      }
    }
  }
  
  walk(srcDir);
  return files;
}

// Rename a file and update all references to it
function renameFile(oldPath) {
  const dir = path.dirname(oldPath);
  const baseName = path.basename(oldPath, '.refactored.tsx');
  
  // Find the new name in our map
  let newBaseName = baseName;
  for (const [cz, en] of Object.entries(FILE_MAP)) {
    if (baseName.includes(cz)) {
      newBaseName = baseName.replace(cz, en);
      break;
    }
  }
  
  // Remove '.refactored' from the name
  newBaseName = newBaseName.replace('.refactored', '');
  const newPath = path.join(dir, `${newBaseName}.tsx`);
  
  // Skip if no change is needed
  if (oldPath === newPath) {
    console.log(`ℹ️  No change needed: ${oldPath}`);
    return null;
  }
  
  try {
    // Rename the file
    fs.renameSync(oldPath, newPath);
    console.log(`✅ Renamed: ${oldPath} -> ${newPath}`);
    
    // Update imports in other files
    updateImports(oldPath, newPath);
    
    return { oldPath, newPath };
  } catch (error) {
    console.error(`❌ Error renaming ${oldPath}:`, error.message);
    return null;
  }
}

// Update imports in all files
function updateImports(oldPath, newPath) {
  const oldImport = path.basename(oldPath, '.tsx');
  const newImport = path.basename(newPath, '.tsx');
  const oldRelativePath = path.relative(process.cwd(), oldPath);
  const newRelativePath = path.relative(process.cwd(), newPath);
  
  // Find and replace imports in all files
  try {
    // Use git grep to find all files that import the old path
    const grepCmd = `git grep -l "${oldImport}" -- '*.ts' '*.tsx' '*.js' '*.jsx' || true`;
    const files = execSync(grepCmd, { cwd: process.cwd() })
      .toString()
      .split('\n')
      .filter(Boolean);
    
    for (const file of files) {
      try {
        let content = fs.readFileSync(file, 'utf8');
        const updatedContent = content
          .replace(
            new RegExp(`from\s+['"]\.*\b${oldImport}\b['"]`, 'g'),
            (match) => {
              // Replace the import path while preserving the relative path structure
              const relativePath = path.relative(
                path.dirname(file),
                path.dirname(newPath)
              );
              const newImportPath = path.join(
                relativePath,
                newImport
              ).replace(/\\/g, '/');
              
              // Handle relative path for same directory
              const normalizedPath = newImportPath.startsWith('..')
                ? newImportPath
                : `./${newImportPath}`;
              
              return match.replace(/['"].*['"]/, `'${normalizedPath}'`);
            }
          )
          .replace(
            new RegExp(`import\s+.*\b${oldImport}\b`, 'g'),
            (match) => match.replace(oldImport, newImport)
          );
        
        if (content !== updatedContent) {
          fs.writeFileSync(file, updatedContent, 'utf8');
          console.log(`  ↳ Updated imports in: ${file}`);
        }
      } catch (error) {
        console.error(`  ↳ Error updating ${file}:`, error.message);
      }
    }
  } catch (error) {
    console.error('Error finding files to update:', error.message);
  }
  
  // Update any references in the dynamic import map
  updateDynamicImportMap(oldImport, newImport);
}

// Update dynamic import map in the calculator router
function updateDynamicImportMap(oldImport, newImport) {
  const importMapPath = path.join(
    process.cwd(),
    'src/app/[locale]/calculator/[category]/[name]/page.tsx'
  );
  
  if (!fs.existsSync(importMapPath)) return;
  
  try {
    let content = fs.readFileSync(importMapPath, 'utf8');
    const updatedContent = content.replace(
      new RegExp(`['"]${oldImport}['"]`, 'g'),
      `'${newImport}'`
    );
    
    if (content !== updatedContent) {
      fs.writeFileSync(importMapPath, updatedContent, 'utf8');
      console.log(`  ↳ Updated dynamic import map in: ${importMapPath}`);
    }
  } catch (error) {
    console.error('Error updating dynamic import map:', error.message);
  }
}

// Main function
function main() {
  console.log('🔍 Finding .refactored.tsx files...\n');
  
  const files = findRefactoredFiles();
  
  if (files.length === 0) {
    console.log('✅ No .refactored.tsx files found.');
    return;
  }
  
  console.log(`Found ${files.length} .refactored.tsx files to process:\n`);
  
  const results = {
    total: files.length,
    renamed: 0,
    skipped: 0,
    errors: 0,
  };
  
  for (const file of files) {
    console.log(`Processing: ${file}`);
    const result = renameFile(file);
    
    if (result) {
      results.renamed++;
    } else if (result === null) {
      results.skipped++;
    } else {
      results.errors++;
    }
    
    console.log();
  }
  
  // Print summary
  console.log('\n📊 Rename Summary:');
  console.log(`- Total files: ${results.total}`);
  console.log(`- Successfully renamed: ${results.renamed}`);
  console.log(`- Skipped (no change needed): ${results.skipped}`);
  console.log(`- Errors: ${results.errors}`);
  
  if (results.renamed > 0) {
    console.log('\n✅ Renaming complete! Please run your tests to ensure everything still works.');
  }
}

// Run the script
main();

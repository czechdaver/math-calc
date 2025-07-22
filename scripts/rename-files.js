#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration for renaming
const RENAME_MAP = {
  // Calculator components
  'cista-mzda': 'net-salary',
  'anuitni-splatka': 'annuity-payment',
  'slozene-uroceni': 'compound-interest',
  'prevodnik-jednotek': 'unit-converter',
  'trojclenka': 'proportions',
  'neprima-umera': 'inverse-proportion',
  'prima-umera': 'direct-proportion',
  'procenta': 'percentages',
  'zlomky': 'fractions',
  'dph': 'vat',
  'bmi': 'bmi',
  'financie-rozsirene': 'finance-advanced',
  'fitness-a-zdravi': 'health-fitness',
  'prakticke-vypocty': 'practical-calculations',
  
  // Calculator names
  'irr': 'irr',
  'npv': 'npv',
  'predcasne-splaceni': 'early-repayment',
  'roi': 'roi',
  'kolik-procent-je-x-z-y': 'percentage-of-number',
  'procento-z-cisla': 'percentage-of',
  'y-je-x-kolik-je-sto': 'find-percentage',
};

// Get the root directory of the project
const rootDir = path.resolve(__dirname, '..');

// Function to rename files and update imports
async function renameFiles() {
  console.log('Starting file renaming process...');
  
  // Track changes for reporting
  const changes = [];
  
  // Process each rename mapping
  for (const [oldName, newName] of Object.entries(RENAME_MAP)) {
    if (oldName === newName) continue; // Skip if names are the same
    
    try {
      // Find all files containing the old name
      const findCmd = `find ${rootDir} -type f -name "*${oldName}*"`;
      const files = execSync(findCmd, { encoding: 'utf8' }).split('\n').filter(Boolean);
      
      for (const oldPath of files) {
        // Skip node_modules and .git directories
        if (oldPath.includes('node_modules') || oldPath.includes('.git')) {
          continue;
        }
        
        const newPath = oldPath.replace(new RegExp(oldName, 'g'), newName);
        
        // Only process if the path actually changed
        if (oldPath !== newPath) {
          // Create directory if it doesn't exist
          const newDir = path.dirname(newPath);
          if (!fs.existsSync(newDir)) {
            fs.mkdirSync(newDir, { recursive: true });
          }
          
          // Rename the file
          fs.renameSync(oldPath, newPath);
          changes.push(`Renamed: ${oldPath} -> ${newPath}`);
          
          // If it's a directory, remove the old one if empty
          try {
            if (fs.statSync(path.dirname(oldPath)).isDirectory()) {
              const filesInDir = fs.readdirSync(path.dirname(oldPath));
              if (filesInDir.length === 0) {
                fs.rmdirSync(path.dirname(oldPath));
                changes.push(`Removed empty directory: ${path.dirname(oldPath)}`);
              }
            }
          } catch (e) {
            // Ignore errors for non-existent directories
          }
        }
      }
      
      // Update imports in all files
      const grepCmd = `grep -rl "${oldName}" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --include="*.json" ${rootDir} 2>/dev/null || true`;
      const filesToUpdate = execSync(grepCmd, { encoding: 'utf8' }).split('\n').filter(Boolean);
      
      for (const file of filesToUpdate) {
        // Skip node_modules and .git directories
        if (file.includes('node_modules') || file.includes('.git')) {
          continue;
        }
        
        try {
          let content = fs.readFileSync(file, 'utf8');
          const updatedContent = content.replace(new RegExp(oldName, 'g'), newName);
          
          if (content !== updatedContent) {
            fs.writeFileSync(file, updatedContent, 'utf8');
            changes.push(`Updated imports in: ${file}`);
          }
        } catch (e) {
          console.error(`Error processing file ${file}:`, e.message);
        }
      }
      
    } catch (error) {
      console.error(`Error processing ${oldName} -> ${newName}:`, error.message);
    }
  }
  
  // Print summary of changes
  console.log('\nSummary of changes:');
  if (changes.length === 0) {
    console.log('No changes were made.');
  } else {
    changes.forEach(change => console.log(`- ${change}`));
    console.log(`\nTotal changes: ${changes.length}`);
  }
  
  console.log('\nDone! Please verify the changes and commit them to version control.');
}

// Run the script
renameFiles().catch(console.error);

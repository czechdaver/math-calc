#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const SRC_DIR = path.join(process.cwd(), 'src');
const IGNORE_DIRS = ['node_modules', '.next', '.git', '__tests__', 'test', 'tests', 'mocks', 'fixtures'];
const IGNORE_FILES = ['.DS_Store', 'next-env.d.ts', '*.d.ts'];

// Naming conventions from CODING_STANDARDS.md
const CONVENTIONS = {
  // File and directory naming
  kebabCase: /^[a-z0-9]+(?:-[a-z0-9]+)*$/, // kebab-case for files and directories
  pascalCase: /^[A-Z][a-zA-Z0-9]*$/, // PascalCase for components
  camelCase: /^[a-z][a-zA-Z0-9]*$/, // camelCase for variables and functions
  upperSnakeCase: /^[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)*$/, // UPPER_SNAKE_CASE for constants
  
  // File extensions
  componentExtensions: ['.tsx', '.jsx'],
  testFileSuffix: '.test',
  
  // Directory patterns
  componentDirs: ['components', 'pages', 'app'],
  hookDirs: ['hooks', 'src/hooks'],
  utilDirs: ['utils', 'lib'],
};

// Results
const results = {
  totalFiles: 0,
  issues: [],
};

// Helper functions
function isIgnoredDir(dir) {
  return IGNORE_DIRS.some(ignored => dir.endsWith(ignored) || dir.includes(`/${ignored}/`));
}

function isIgnoredFile(file) {
  return IGNORE_FILES.some(ignored => {
    if (ignored.startsWith('*')) {
      return file.endsWith(ignored.substring(1));
    }
    return file === ignored;
  });
}

function checkFileName(filePath) {
  const fileName = path.basename(filePath);
  const ext = path.extname(filePath);
  const name = path.basename(fileName, ext);
  const dirName = path.dirname(filePath);
  
  // Skip ignored files and directories
  if (isIgnoredFile(fileName) || isIgnoredDir(dirName)) {
    return;
  }
  
  results.totalFiles++;
  
  // Check component files (PascalCase)
  if (CONVENTIONS.componentExtensions.includes(ext) && !name.endsWith(CONVENTIONS.testFileSuffix)) {
    if (!CONVENTIONS.pascalCase.test(name)) {
      results.issues.push({
        type: 'component',
        file: filePath,
        issue: `Component file should be in PascalCase (e.g., MyComponent.tsx), found: ${fileName}`,
      });
    }
  }
  
  // Check test files (ComponentName.test.tsx)
  if (name.endsWith(CONVENTIONS.testFileSuffix)) {
    const baseName = name.substring(0, name.length - CONVENTIONS.testFileSuffix.length);
    if (!CONVENTIONS.pascalCase.test(baseName)) {
      results.issues.push({
        type: 'test',
        file: filePath,
        issue: `Test file should be named after the component in PascalCase (e.g., MyComponent.test.tsx), found: ${fileName}`,
      });
    }
  }
  
  // Check utility files (camelCase)
  if (dirName.includes('utils') || dirName.includes('lib')) {
    if (!CONVENTIONS.camelCase.test(name) && !name.endsWith('.d')) {
      results.issues.push({
        type: 'utility',
        file: filePath,
        issue: `Utility file should be in camelCase (e.g., myUtility.ts), found: ${fileName}`,
      });
    }
  }
  
  // Check directory names (kebab-case)
  const dirs = dirName.split(path.sep);
  for (const dir of dirs) {
    if (dir && !CONVENTIONS.kebabCase.test(dir) && !isIgnoredDir(dir)) {
      results.issues.push({
        type: 'directory',
        file: dirName,
        issue: `Directory name should be in kebab-case (e.g., my-directory), found: ${dir}`,
      });
    }
  }
}

// Main function
function checkNamingConventions() {
  console.log('🔍 Checking naming conventions...\n');
  
  // Walk through the src directory
  function walk(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        if (!isIgnoredDir(filePath)) {
          walk(filePath);
        }
      } else {
        checkFileName(filePath);
      }
    }
  }
  
  walk(SRC_DIR);
  
  // Print results
  console.log(`📊 Scanned ${results.totalFiles} files\n`);
  
  if (results.issues.length === 0) {
    console.log('✅ All files follow the naming conventions!');
    return;
  }
  
  console.log(`⚠️  Found ${results.issues.length} naming convention issues:\n`);
  
  // Group issues by type
  const issuesByType = results.issues.reduce((acc, issue) => {
    if (!acc[issue.type]) {
      acc[issue.type] = [];
    }
    acc[issue.type].push(issue);
    return acc;
  }, {});
  
  // Print issues by type
  for (const [type, issues] of Object.entries(issuesByType)) {
    console.log(`📁 ${type.toUpperCase()} (${issues.length} issues):`);
    for (const issue of issues) {
      console.log(`   - ${issue.file}`);
      console.log(`     ${issue.issue}`);
    }
    console.log();
  }
  
  console.log('💡 Run `npm run lint:fix` to automatically fix some of these issues.');
}

// Run the check
checkNamingConventions();

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

// Custom error class for documentation generation
class DocGenError extends Error {
  constructor(message, filePath) {
    super(message);
    this.name = 'DocGenError';
    this.filePath = filePath;
  }
}

// Configuration
const VERSION = '1.2.0';
const UPDATED = new Date().toISOString().split('T')[0];
const DOCS_ROOT = path.join(__dirname, '..', 'docs');
const TARGET_STRUCTURE = {
  'getting-started': {
    'installation.md': {
      title: 'Installation',
      category: 'Getting Started',
      content: `# Installation

## Prerequisites
- Node.js 18+
- npm or yarn

## Setup

1. Clone the repository:
   \`\`\`bash
git clone https://github.com/yourusername/math-calc.git
cd math-calc
   \`\`\`

2. Install dependencies:
   \`\`\`bash
npm install
# or
yarn
   \`\`\`

3. Start the development server:
   \`\`\`bash
npm run dev
# or
yarn dev
   \`\`\`

4. Open http://localhost:3000 in your browser.`
    },
    'development.md': {
      title: 'Development Guide',
      category: 'Getting Started',
      content: `# Development Guide

## Project Structure

\`\`\`
src/
├── app/                    # Next.js app router pages
├── components/            # Reusable UI components
│   ├── calculators/       # Calculator components
│   └── ui/                # shadcn/ui components
├── lib/                   # Utility functions and config
├── styles/                # Global styles and themes
└── utils/                 # Helper functions and hooks
\`\`\`

## Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm start\` - Start production server
- \`npm test\` - Run tests
- \`npm run lint\` - Run linter
- \`npm run format\` - Format code with Prettier`
    }
  },
  'reference': {
    'coding-standards.md': {
      title: 'Coding Standards',
      category: 'Reference',
      source: 'CODING_STANDARDS.md'
    },
    'testing-guide.md': {
      title: 'Testing Guide',
      category: 'Reference',
      source: 'TESTING_PLAN.md'
    },
    'api-documentation.md': {
      title: 'API Documentation',
      category: 'Reference',
      source: 'requirements/api-documentation.md'
    },
    'state-management.md': {
      title: 'State Management',
      category: 'Reference',
      source: 'requirements/state-management.md'
    }
  },
  'design': {
    'calculator-layout.md': {
      title: 'Calculator Layout',
      category: 'Design',
      source: 'design/calculator-layout.md'
    },
    'homepage-layout.md': {
      title: 'Homepage Layout',
      category: 'Design',
      source: 'design/homepage-layout.md'
    },
    'style-guide.md': {
      title: 'Style Guide',
      category: 'Design',
      source: 'design/style-guide.md'
    },
    'ui-components.md': {
      title: 'UI Components',
      category: 'Design',
      content: `# UI Components

## Available Components

- [Accordion](/docs/design/accordion)
- [Loading Spinner](/docs/design/loading-spinner)
- [Modal](/docs/design/modal)
- [Pagination](/docs/design/pagination)
- [Tabs](/docs/design/tabs)
- [Toast](/docs/design/toast)
- [Tooltip](/docs/design/tooltip)`
    }
  },
  'requirements': {
    'tech-specs.md': {
      title: 'Technical Specifications',
      category: 'Requirements',
      source: 'requirements/tech-specs.md'
    },
    'firebase-setup.md': {
      title: 'Firebase Setup',
      category: 'Requirements',
      source: 'requirements/firebase-zadani.md'
    },
    'testing-strategy.md': {
      title: 'Testing Strategy',
      category: 'Requirements',
      source: 'requirements/testing-strategy.md'
    }
  },
  'changelog': {
    'CHANGELOG.md': {
      title: 'Changelog',
      category: 'Changelog',
      content: `# Changelog

All notable changes to this project will be documented in this file.

## [${VERSION}] - ${UPDATED}

### Added
- Initial project structure
- Basic calculator functionality
- Documentation`
    }
  }
};

// Component documentation mapping
const COMPONENT_DOCS = {
  'accordion': 'components/accordion.md',
  'loading-spinner': 'components/loading-spinner.md',
  'modal': 'components/modal.md',
  'pagination': 'components/pagination.md',
  'tabs': 'components/tabs.md',
  'toast': 'components/toast.md',
  'tooltip': 'components/tooltip.md'
};

/**
 * Create directory if it doesn't exist
 * @param {string} dir - Directory path to create
 * @throws {DocGenError} If directory creation fails
 */
function ensureDir(dir) {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(chalk.green(`Created directory: ${dir}`));
    }
  } catch (error) {
    throw new DocGenError(`Failed to create directory: ${error.message}`, dir);
  }
}

// Generate YAML front matter
function generateFrontMatter(title, category) {
  return `---
title: ${title}
category: ${category}
version: ${VERSION}
updated: ${UPDATED}
---

`;
}

/**
 * Process a single documentation file
 * @param {string} targetDir - Target directory path
 * @param {string} fileName - Output file name
 * @param {Object} config - File configuration
 * @param {string} [config.source] - Source file path relative to DOCS_ROOT
 * @param {string} [config.content] - Direct content for the file
 * @param {string} config.title - Document title
 * @param {string} config.category - Document category
 * @throws {DocGenError} If file processing fails
 */
async function processFile(targetDir, fileName, config) {
  const targetPath = path.join(targetDir, fileName);
  let content = '';

  try {
    if (config.source) {
      const sourcePath = path.join(DOCS_ROOT, config.source);
      if (fs.existsSync(sourcePath)) {
        content = await fs.readFile(sourcePath, 'utf8');
        console.log(chalk.blue(`Processing source: ${sourcePath}`));
      } else {
        const msg = `Source file not found: ${sourcePath}`;
        console.warn(chalk.yellow(`⚠️  ${msg}`));
        content = `# ${config.title}\n\n> ⚠️  **Note**: This document is a placeholder.\n> The source file was not found at: \`${config.source}\`\n\n*Documentation coming soon.*`;
      }
    } else if (config.content) {
      content = config.content;
    } else {
      throw new DocGenError('No content or source specified for document', targetPath);
    }

    // Add front matter if not already present
    if (!content.trim().startsWith('---')) {
      content = generateFrontMatter(config.title, config.category) + content;
    } else {
      console.log(chalk.blue(`Preserved existing front matter in: ${targetPath}`));
    }

    await fs.writeFile(targetPath, content);
    console.log(chalk.green(`✓ Created: ${path.relative(process.cwd(), targetPath)}`));
    return true;
  } catch (error) {
    if (error instanceof DocGenError) throw error;
    throw new DocGenError(`Failed to process file: ${error.message}`, targetPath);
  }
}

/**
 * Generate documentation for components
 * @throws {DocGenError} If component documentation generation fails
 */
async function generateComponentDocs() {
  const targetDir = path.join(DOCS_ROOT, 'design');
  ensureDir(targetDir);
  let componentCount = 0;
  let errorCount = 0;

  console.log(chalk.blue('\nProcessing component documentation...'));
  
  for (const [component, sourcePath] of Object.entries(COMPONENT_DOCS)) {
    const targetPath = path.join(targetDir, `${component}.md`);
    
    try {
      const fullSourcePath = path.join(DOCS_ROOT, sourcePath);
      if (!fs.existsSync(fullSourcePath)) {
        console.warn(chalk.yellow(`⚠️  Component source not found: ${sourcePath}`));
        continue;
      }
      
      const sourceContent = await fs.readFile(fullSourcePath, 'utf8');
      const title = component.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      
      const content = generateFrontMatter(title, 'Components') + sourceContent;
      await fs.writeFile(targetPath, content);
      console.log(chalk.green(`✓ Created component doc: ${path.relative(process.cwd(), targetPath)}`));
      componentCount++;
    } catch (error) {
      errorCount++;
      console.error(chalk.red(`❌ Failed to process component ${component}:`));
      console.error(chalk.red(`  ${error.message}`));
      console.error(chalk.dim(`  Source: ${sourcePath}`));
      console.error(chalk.dim(`  Target: ${targetPath}`));
    }
  }

  // Summary
  console.log('\n' + '-'.repeat(60));
  if (errorCount > 0) {
    console.log(chalk.yellow(`Processed ${componentCount} components with ${errorCount} errors`));
  } else {
    console.log(chalk.green(`✓ Successfully processed ${componentCount} components`));
  }
  console.log('-'.repeat(60));
  
  if (errorCount > 0) {
    throw new DocGenError(`Failed to process ${errorCount} component(s)`, targetDir);
  }
  
  return componentCount;
}

// Generate index.md with TOC
async function generateIndex() {
  const indexPath = path.join(DOCS_ROOT, 'index.md');
  let content = `---
title: Documentation
category: Overview
version: ${VERSION}
updated: ${UPDATED}
---

# Math Calculator Pro Documentation

## Table of Contents
`;

  // Add TOC sections
  for (const [section, files] of Object.entries(TARGET_STRUCTURE)) {
    const sectionTitle = section.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    content += `
### ${sectionTitle}
`;
    
    for (const [file, config] of Object.entries(files)) {
      const name = config.title || file.replace(/\.md$/, '');
      const link = `/${section}/${file.replace(/\.md$/, '')}`;
      content += `- [${name}](${link})\n`;
    }
  }

  // Add components section
  content += `
### Components
`;
  for (const component of Object.keys(COMPONENT_DOCS)) {
    const name = component.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    content += `- [${name}](/design/${component})\n`;
  }

  await fs.writeFile(indexPath, content);
  console.log(`Created: ${indexPath}`);
}

/**
 * Generate LLM configuration file with file patterns for documentation
 * @throws {DocGenError} If LLM config file generation fails
 */
async function generateLLMsTxt() {
  const llmsPath = path.join(process.cwd(), 'llms.txt');
  const content = `# LLM Configuration for Math Calculator Pro
# Version: ${VERSION}
# Updated: ${UPDATED}
# 
# This file tells LLM tools which files to include when analyzing the project.
# It helps provide better context for documentation and code understanding.

# Include all markdown files in the docs directory
docs/**/*.md

# Include configuration files
*.json
*.yaml
*.yml
*.env*

# Source code (TypeScript/JavaScript)
src/**/*.ts
src/**/*.tsx
src/**/*.js

# Documentation and project files
README.md
CONTRIBUTING.md
CHANGELOG.md
package.json
tsconfig.json
next.config.js

# Test files
**/*.test.ts
**/*.spec.ts

# Exclude directories
node_modules/**
.next/**
out/**
dist/**
build/**
coverage/**

# Exclude files
*.log
*.lock
*.min.js
*.min.css
.DS_Store

# Ignore environment-specific files
.env.local
.env.development.local
.env.test.local
.env.production.local
`;

  try {
    await fs.writeFile(llmsPath, content);
    console.log(chalk.green(`✓ Created LLM configuration: ${path.relative(process.cwd(), llmsPath)}`));
    return true;
  } catch (error) {
    throw new DocGenError(`Failed to generate LLM config: ${error.message}`, llmsPath);
  }
}

// Main function
async function main() {
  console.log(chalk.cyan('\n📚 Starting documentation restructuring...\n'));
  const startTime = Date.now();
  let processedFiles = 0;
  let errorCount = 0;

  try {
    // Create target directories
    console.log(chalk.cyan('📂 Creating directory structure...'));
    for (const dir of Object.keys(TARGET_STRUCTURE)) {
      ensureDir(path.join(DOCS_ROOT, dir));
    }

    // Process files
    console.log('\n📄 Processing documentation files...');
    for (const [dir, files] of Object.entries(TARGET_STRUCTURE)) {
      const targetDir = path.join(DOCS_ROOT, dir);
      ensureDir(targetDir);

      for (const [file, config] of Object.entries(files)) {
        try {
          await processFile(targetDir, file, config);
          processedFiles++;
        } catch (error) {
          errorCount++;
          console.error(chalk.red(`\n❌ Error processing ${file}:`));
          console.error(chalk.red(`  ${error.message}`));
          if (error.filePath) {
            console.error(chalk.dim(`  Path: ${error.filePath}`));
          }
        }
      }
    }

    // Generate component documentation
    console.log('\n🔧 Generating component documentation...');
    try {
      await generateComponentDocs();
    } catch (error) {
      errorCount++;
      console.error(chalk.red('\n❌ Error generating component docs:'));
      console.error(chalk.red(`  ${error.message}`));
    }

    // Generate index.md with TOC
    console.log('\n📑 Generating table of contents...');
    try {
      await generateIndex();
      processedFiles++;
    } catch (error) {
      errorCount++;
      console.error(chalk.red('\n❌ Error generating index:'));
      console.error(chalk.red(`  ${error.message}`));
    }

    // Generate llms.txt
    console.log('\n🤖 Generating LLM configuration...');
    try {
      await generateLLMsTxt();
      processedFiles++;
    } catch (error) {
      errorCount++;
      console.error(chalk.red('\n❌ Error generating LLM configuration:'));
      console.error(chalk.red(`  ${error.message}`));
    }

    // Print summary
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log('\n' + '='.repeat(60));
    
    if (errorCount > 0) {
      console.log(chalk.yellow(`\n⚠️  Completed with ${errorCount} error(s) in ${duration}s`));
      console.log(chalk.yellow(`   Processed ${processedFiles} files successfully`));
      console.log(chalk.yellow('   Check the logs above for details on any errors'));
      process.exit(1);
    } else {
      console.log(chalk.green(`\n✅ Successfully processed ${processedFiles} files in ${duration}s`));
      console.log(chalk.green('   Documentation restructured successfully!'));
    }
    
    console.log('='.repeat(60) + '\n');
  } catch (error) {
    console.error(chalk.red('\n❌ Fatal error during documentation generation:'));
    console.error(chalk.red(`  ${error.message}`));
    if (error.filePath) {
      console.error(chalk.dim(`  Path: ${error.filePath}`));
    }
    process.exit(1);
  }
}

// Run the script
main();

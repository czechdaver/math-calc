const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

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

// Create directory if it doesn't exist
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
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

// Process a single file
async function processFile(targetDir, fileName, config) {
  const targetPath = path.join(targetDir, fileName);
  let content = '';

  if (config.source) {
    const sourcePath = path.join(DOCS_ROOT, config.source);
    if (fs.existsSync(sourcePath)) {
      content = await fs.readFile(sourcePath, 'utf8');
    } else {
      console.warn(`Source file not found: ${sourcePath}`);
      content = `# ${config.title}\n\n*Documentation coming soon.*`;
    }
  } else if (config.content) {
    content = config.content;
  }

  // Add front matter if not already present
  if (!content.startsWith('---')) {
    content = generateFrontMatter(config.title, config.category) + content;
  }

  await fs.writeFile(targetPath, content);
  console.log(`Created: ${targetPath}`);
}

// Generate component documentation
async function generateComponentDocs() {
  const targetDir = path.join(DOCS_ROOT, 'design');
  ensureDir(targetDir);

  for (const [component, sourcePath] of Object.entries(COMPONENT_DOCS)) {
    const targetPath = path.join(targetDir, `${component}.md`);
    const sourceContent = await fs.readFile(path.join(DOCS_ROOT, sourcePath), 'utf8');
    
    const title = component.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    const content = generateFrontMatter(title, 'Components') + sourceContent;
    await fs.writeFile(targetPath, content);
    console.log(`Created component doc: ${targetPath}`);
  }
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

// Generate llms.txt
async function generateLLMsTxt() {
  const llmsPath = path.join(process.cwd(), 'llms.txt');
  const content = `# LLM Configuration for Math Calculator Pro
# Version: ${VERSION}
# Updated: ${UPDATED}

# Include all markdown files in the docs directory
docs/**/*.md

# Include configuration files
*.json
*.yaml
*.yml

# Include source code for context
src/**/*.ts
src/**/*.tsx
src/**/*.js

# Include documentation
README.md
CONTRIBUTING.md
CHANGELOG.md

# Exclude
node_modules/**
.next/**
out/**
*.log
*.lock
`;

  await fs.writeFile(llmsPath, content);
  console.log(`Created: ${llmsPath}`);
}

// Main function
async function main() {
  console.log('Restructuring documentation...\n');

  try {
    // Create target directories
    for (const dir of Object.keys(TARGET_STRUCTURE)) {
      ensureDir(path.join(DOCS_ROOT, dir));
    }

    // Process files
    for (const [dir, files] of Object.entries(TARGET_STRUCTURE)) {
      const targetDir = path.join(DOCS_ROOT, dir);
      ensureDir(targetDir);

      for (const [file, config] of Object.entries(files)) {
        await processFile(targetDir, file, config);
      }
    }

    // Generate component documentation
    await generateComponentDocs();

    // Generate index.md with TOC
    await generateIndex();

    // Generate llms.txt
    await generateLLMsTxt();

    console.log('\nDocumentation restructured successfully!');
  } catch (error) {
    console.error('Error restructuring documentation:', error);
    process.exit(1);
  }
}

// Run the script
main();

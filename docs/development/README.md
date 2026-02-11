# MathCalc Pro - Development Guide

## Project Philosophy: Simplicity Over Complexity

**Core Principle:** We prefer simple, robust solutions over complex architectures.

## AI Development Guidelines

**For AI Systems (Windsurf/Cascade):**

1. **Always check documentation** before making changes
2. **Follow simplicity-first principle** in all implementations
3. **Update documentation** when adding new features
4. **Validate all changes** with provided test commands
5. **Maintain fallback mechanisms** for all critical functions

**Required AI Actions:**
- Review this documentation before each development session
- Update relevant sections when implementing new features
- Ensure all code examples remain executable
- Maintain consistency with project philosophy

## Development Workflow

### 1. Installation
```bash
npm install
npm run dev
```

### 2. Validation
```bash
# Test basic routes
curl -I http://localhost:3000/cs
curl -I http://localhost:3000/en
```

### 3. Testing
```bash
# Run tests
npm test

# Watch mode during development
npm run test:watch

# Type checking
npx tsc --noEmit
```

### 4. Build
```bash
# Production build
npm run build

# Production server
npm start
```

### 5. Linting
```bash
npm run lint
```

## Troubleshooting

For common issues and solutions, see [Troubleshooting Guide](./troubleshooting-guide.md).

## Additional Documentation

- [Project Specifications](../requirements/project-specifications.md) - Main specs with simplicity philosophy
- [Technical Specifications](../requirements/tech-specs.md) - Detailed technical requirements
- [Testing Strategy](../requirements/testing-strategy.md) - Testing approach and best practices
- [Refactoring Guidelines](./refactoring-guidelines.md) - Rules for code refactoring
- [Calculator Status](./calculator-status-audit.md) - Current implementation status

## Tips

1. **Always choose the simplest working solution**
2. **Implement fallback mechanisms** for all critical functions
3. **Write explicit error handling** - no silent failures
4. **Document your changes** - keep docs in sync with code
5. **Test before committing** - ensure nothing is broken

---

**Project Motto:** "The best code is code that works reliably and can be easily understood."

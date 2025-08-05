---
title: Coding Standards
category: Reference
version: 1.2.0
updated: 2025-07-23
---

# Coding Standards and Naming Conventions

## 🚨 Critical Development Rules

### Dependency Management

**MANDATORY: Use Only Stable Versions**

- **NEVER use bleeding-edge or beta versions** in production projects
- Always specify stable version ranges in package.json
- Avoid `@latest` tags - use specific stable versions

**Examples:**
```json
// ✅ CORRECT - Stable versions
{
  "tailwindcss": "^3.4.0",    // NOT v4.x (unstable)
  "next": "^14.2.0",          // Use LTS when available
  "react": "^18.2.0",         // Stable release
  "typescript": "^5.3.0"      // Stable release
}

// ❌ WRONG - Bleeding-edge versions
{
  "tailwindcss": "^4.1.0",    // Causes compatibility issues
  "next": "^15.0.0-canary",   // Unstable canary release
  "react": "^19.0.0-beta"     // Beta version
}
```

**Rationale:**
- Bleeding-edge versions often have compatibility issues
- Missing dependencies and breaking changes are common
- Stable versions ensure reliable builds and deployments
- Easier troubleshooting with well-documented stable releases

**Before Adding New Dependencies:**
1. Check if the library has a stable release
2. Verify compatibility with existing stack
3. Install all required peer dependencies
4. Test thoroughly before committing

## File and Directory Naming

### General Rules
- Use **kebab-case** for all file and directory names
- Keep file names short but descriptive
- Use consistent naming patterns across the project

### File Types
- **React Components**: `ComponentName.tsx` (PascalCase)
- **Test Files**: `ComponentName.test.tsx`
- **Utility Files**: `utility-name.ts`
- **Configuration Files**: `config-name.ts`
- **Type Definitions**: `types.ts` or `component-name.types.ts`

## Code Style

### Variables and Functions
- Use **camelCase** for variables and functions
- Use descriptive names that indicate purpose
- Avoid abbreviations unless widely understood
- Use English for all new code

### Components
- Use **PascalCase** for component names
- Match component name with file name
- Use descriptive names that indicate the component's purpose
- Prefer named exports over default exports

### Types and Interfaces
- Use **PascalCase** for type and interface names
- Prefix with `I` for interfaces (e.g., `IUserData`)
- Use descriptive, specific names
- Define types close to where they're used

### Constants
- Use **UPPER_SNAKE_CASE** for constants
- Group related constants in objects or enums
- Define constants in a dedicated file if used in multiple places

## Calculator Naming Conventions

### Calculator Components
- Use descriptive names that indicate the calculation
- Follow the pattern: `{Calculation}Calculator.tsx`
  - Example: `BMICalculator.tsx`, `NetSalaryCalculator.tsx`

### Calculator Categories
- Use kebab-case for category names
- Keep category names short and descriptive
- Examples:
  - `finance` - Financial calculators
  - `health` - Health and fitness calculators
  - `math` - Mathematical calculators
  - `conversion` - Unit converters

### Calculator Routes
- Follow the pattern: `/calculator/{category}/{calculator-name}`
- Use kebab-case for all route segments
- Keep URLs short and descriptive

## Testing

### Test Files
- Place test files next to the code they test
- Use the pattern: `ComponentName.test.tsx`
- For test utilities, use the pattern: `test-utils.ts`

### Test Naming
- Use descriptive test names that explain the expected behavior
- Follow the pattern: `should {expected behavior} when {condition}`
- Group related tests in `describe` blocks

## Documentation

### Comments
- Use JSDoc for public APIs and complex logic
- Keep comments focused on "why" not "what"
- Update comments when code changes

### README Files
- Include a `README.md` in each major directory
- Document the purpose and usage of files in the directory
- Keep documentation up to date

## Best Practices

### Imports
- Group imports in the following order:
  1. External dependencies
  2. Internal absolute imports
  3. Internal relative imports
  4. Styles and types
- Use absolute imports (`@/`) for project files

### Error Handling
- Use custom error classes for different error types
- Provide helpful error messages
- Log errors appropriately

### Performance
- Use `React.memo()` for expensive components
- Implement proper cleanup in `useEffect`
- Use `useCallback` and `useMemo` appropriately

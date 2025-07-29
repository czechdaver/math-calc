# MathCalc Pro - AI Development Rules

## 🎯 Core Philosophy: Simplicity Over Complexity

**Primary Rule:** Always prefer simple, robust solutions over complex architectures.

## 📋 Documentation Standards

- **Language:** All documentation must be written in English
- **AI Integration:** Documentation must be regularly reviewed and updated by AI systems
- **Validation:** All code examples must be immediately executable
- **Updates:** Keep documentation current with code changes

## 🛠️ Technical Guidelines

### Next.js & React Patterns
- Use Next.js 13+ App Router patterns
- Implement locale-based routing with [locale] directory structure
- Use client components for interactive calculators
- Implement proper error boundaries for all dynamic components

### Internationalization (i18n)
- Use next-intl with fallback mechanisms
- Always implement fallback for undefined locale: `const validLocale = locale || 'cs'`
- Use simple middleware configuration over complex custom solutions
- Test all localized routes after configuration changes

### Code Structure & Organization
- Follow the established directory structure:
  - `/src/app/[locale]/` for localized pages
  - `/src/app/[locale]/calculator/` for calculator components
  - Dynamic imports with loading states for calculator components
- Use TypeScript for all code with proper type definitions
- Implement JSDoc comments for public methods and components

### Error Handling & Fallbacks
- **Critical Rule:** Every critical function must have a fallback mechanism
- Implement explicit error handling over implicit assumptions
- Use Error Boundaries for React components
- Validate all async parameters with fallback values

### Development Workflow
- Always validate installation with: `curl -I http://localhost:3000/cs`
- Expected result: 200 OK for localized routes
- Check troubleshooting guide for 404/500 errors
- Update documentation when adding new features

## 🚨 Common Issues & Solutions

### Next.js 15 + next-intl Compatibility
- **Problem:** 404/500 errors on localized routes
- **Cause:** Undefined locale parameter in next-intl config
- **Solution:** Implement fallback in next-intl.config.ts
- **Validation:** Test with curl commands after changes

### Routing Configuration
- Use basic next-intl middleware configuration
- Avoid complex custom middleware functions
- Prefer `localePrefix: 'always'` for consistency
- Test all supported locales (cs, en, sk, pl, hu)

## 📊 Project Architecture

### Current Implementation
- **Routing:** Functional with locale support (cs, en, sk, pl, hu)
- **Core Calculators:** MVP calculators implemented (procenta, bmi, dph, cista-mzda, prevodnik-jednotek, trojclenka)
- **i18n:** next-intl with robust fallback mechanisms
- **Documentation:** English-first, AI-optimized

### Calculator Organization
- Individual calculators in specific subdirectories
- Dynamic imports with loading states and error boundaries
- Client-side rendering for calculator components
- SEO metadata components for each calculator

## 🤖 AI Development Requirements

### Before Making Changes
1. Review this rules file
2. Check existing documentation
3. Validate current functionality
4. Follow simplicity-first principle

### When Implementing Features
1. Use the simplest working solution
2. Implement fallback mechanisms
3. Add proper error handling
4. Update relevant documentation
5. Test with provided validation commands

### After Implementation
1. Validate all routes work correctly
2. Update documentation if needed
3. Ensure code follows established patterns
4. Test error scenarios and fallbacks

## 📝 Code Examples

### Correct next-intl Configuration
```typescript
// next-intl.config.ts
export default getRequestConfig(async ({locale}) => {
  const validLocale = locale || 'cs'; // CRITICAL: Fallback!
  
  return {
    locale: validLocale,
    messages: (await import(`./src/messages/${validLocale}.json`)).default
  };
});
```

### Proper Error Boundary Implementation
```typescript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
```

## 🎯 Success Metrics

- All routes return appropriate HTTP status codes
- Documentation is current and accurate
- Code follows established patterns
- Fallback mechanisms work correctly
- AI can understand and update the codebase effectively

---

**Project Motto:** "The best code is code that works reliably and can be easily understood."

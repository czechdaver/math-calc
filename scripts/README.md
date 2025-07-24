# Calculator Optimization Scripts

This directory contains scripts for optimizing calculator pages in the MathCalc Pro application.

## optimize-calculators.js

This script applies performance optimizations to all calculator pages, including:

- Code splitting with dynamic imports
- Loading states with skeleton placeholders
- Error boundaries for graceful error handling
- Memoization of translations
- Responsive layout improvements

### Prerequisites

- Node.js 14+
- npm or yarn

### Usage

1. Navigate to the project root directory
2. Run the script:

```bash
node scripts/optimize-calculators.js
```

### What It Does

1. Scans the `/src/app/[locale]/calculator` directory for calculator pages
2. For each calculator page:
   - Creates a backup of the original file with a `.bak` extension
   - Applies the optimization template
   - Preserves existing calculator logic while adding performance improvements

### Features

- **Code Splitting**: Loads calculator components only when needed
- **Loading States**: Shows skeleton placeholders during loading
- **Error Boundaries**: Prevents the entire page from crashing on errors
- **Memoization**: Reduces unnecessary re-renders
- **Type Safety**: Includes TypeScript types for better developer experience

### Customization

You can customize the optimization by modifying the template in `optimize-calculators.js`. The template includes placeholders that are automatically replaced with calculator-specific values.

### Rollback

If needed, you can restore the original files by removing the `.tsx` files and renaming the `.bak` files back to `.tsx`.

## Best Practices

1. **Always commit your changes** before running the optimization script
2. **Review the changes** after optimization
3. **Test each calculator** to ensure functionality is preserved
4. **Update translations** for any new UI elements in the translation files

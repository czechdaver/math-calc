# Troubleshooting Guide - MathCalc Pro

**AI Documentation Rule:** This troubleshooting guide must be maintained in English and regularly updated.

## 🚨 Critical Issues and Solutions

### 1. Next.js 15 + next-intl: 404/500 Errors on Localized Routes

**Problem:** Application returns 404 or 500 errors on all localized routes (`/cs`, `/en`, etc.)

**Cause:** Next.js 15 has changes in how it processes async params. The `locale` parameter can be `undefined` in next-intl configuration.

**Solution:**
```typescript
// next-intl.config.ts
import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => {
  // CRITICAL: Always implement fallback for locale parameter
  const validLocale = locale || 'cs';
  
  return {
    locale: validLocale,
    messages: (await import(`./src/messages/${validLocale}.json`)).default
  };
});
```

**Validation:**
```bash
curl -I http://localhost:3000/cs
# Expected: HTTP/1.1 200 OK
```

**Key Insights:**
- Always implement fallback for `locale` parameter
- Use basic middleware configuration without unnecessary optimizations
- Test all localized routes after changes

### 2. Middleware Configuration Issues

**Recommended Simple Configuration:**
```typescript
// middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['cs', 'en', 'sk', 'pl', 'hu'],
  defaultLocale: 'cs',
  localePrefix: 'always'
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
```

**Avoid:**
- Complex custom middleware functions
- Complicated skip logic
- `localePrefix: 'as-needed'` (can cause issues)

### 3. Next.js 15 Async Params in Layout Components

**Problem:** Next.js 15 requires different approach to async params in layout components.

**Solution:**
```typescript
// app/[locale]/layout.tsx
interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // CRITICAL: Promise wrapper
}

export default async function LocaleLayout({
  children,
  params
}: Props) {
  const { locale } = await params; // Await the params
  const validLocale = locale || 'cs'; // Fallback mechanism
  
  // Rest of component logic...
}
```

### 4. CSS/Tailwind Compilation Issues

**Problem:** CSS styles not loading, pages display as plain HTML without styling.

**Common Causes:**
1. **Missing dependencies** - Required packages not installed
2. **Version incompatibility** - Using bleeding-edge versions with compatibility issues
3. **Missing PostCSS configuration** - Tailwind requires PostCSS to compile

**Solution Steps:**

1. **Use Stable Versions Only:**
```bash
# CRITICAL: Always use stable versions, not latest/beta
npm install tailwindcss@^3.4.0  # NOT v4.x (unstable)
npm install postcss@^8.4.0
npm install autoprefixer@^10.4.0
```

2. **Install Missing Dependencies:**
```bash
# Check for missing animation library
npm install tailwindcss-animate

# Verify all shadcn/ui dependencies
npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge
```

3. **Ensure PostCSS Configuration:**
```javascript
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

4. **Clear Cache and Restart:**
```bash
rm -rf .next
npm run dev
```

**Validation:**
- Create test page with Tailwind classes
- Verify colored backgrounds and styled components render
- Check browser dev tools for CSS file loading

**Key Insights:**
- **NEVER use bleeding-edge versions** in production projects
- Always install all required dependencies before testing
- PostCSS configuration is mandatory for Tailwind compilation
- Clear cache after major dependency changes

## 🎯 General Guidelines for Robust Development

### 1. Simplicity Over Complexity
- Always choose the simplest solution that works
- Add complexity only when truly necessary
- Prefer explicit code over "smart" abstractions

### 2. Fallback Mechanisms
- Every critical function must have a fallback
- Locale parameters always with default value
- Error boundaries for all dynamic components

### 3. Compatibility Testing
- Test all routes after configuration changes
- Verify functionality in different environments
- Document all known issues and their solutions

### 4. Debugging Approach
- Use server logs for problem diagnosis
- Test HTTP status codes using curl
- Gradually simplify configuration until functional state

## 📝 Checklist for New Features

- [ ] Is the implementation as simple as possible?
- [ ] Do fallback mechanisms exist?
- [ ] Are all async operations properly handled?
- [ ] Does it work in all supported locales?
- [ ] Is the code easily readable and maintainable?
- [ ] Are necessary error boundaries added?

## 🔧 Debugging Tools

### Route Testing:
```bash
# Test main locale routes
curl -I http://localhost:3000/cs
curl -I http://localhost:3000/en
curl -I http://localhost:3000/sk

# Test calculator routes
curl -I http://localhost:3000/cs/calculator/procenta
curl -I http://localhost:3000/en/calculator/percentage

# Expected: HTTP/1.1 200 OK for all
```

### Development Server:
```bash
# Start development server
npm run dev

# Check for errors in console
# Verify all routes return 200 OK
```

### Common Error Patterns:

#### 500 Internal Server Error
**Cause:** Usually undefined locale parameter
**Fix:** Add fallback in next-intl.config.ts

#### 404 Not Found
**Cause:** Middleware not catching routes properly
**Fix:** Check middleware matcher configuration

#### Build Errors
**Cause:** TypeScript type mismatches with async params
**Fix:** Update interface definitions for Next.js 15

## 🚀 Performance Troubleshooting

### Slow Page Loads
1. Check bundle size: `npm run analyze`
2. Verify dynamic imports are working
3. Check for unnecessary re-renders
4. Optimize images and assets

### Memory Issues
1. Check for memory leaks in calculators
2. Verify proper cleanup in useEffect
3. Monitor component unmounting

### SEO Issues
1. Verify meta tags are generated correctly
2. Check sitemap.xml generation
3. Test structured data markup
4. Validate hreflang tags

## 🔍 Monitoring and Logging

### Error Tracking
```typescript
// Error boundary implementation
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Calculator error:', error, errorInfo);
    // Send to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong with this calculator.</div>;
    }
    return this.props.children;
  }
}
```

### Performance Monitoring
```typescript
// Core Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  gtag('event', metric.name, {
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    event_category: 'Web Vitals',
    event_label: metric.id,
    non_interaction: true,
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

## 🌐 Internationalization Troubleshooting

### Missing Translations
1. Check message files in `/src/messages/`
2. Verify key exists in all locale files
3. Check for typos in translation keys

### Locale Detection Issues
1. Verify Accept-Language header handling
2. Check default locale fallback
3. Test manual locale switching

### Format Issues
1. Verify number formatting per locale
2. Check currency formatting
3. Validate date/time formats

## 🔐 Security Troubleshooting

### GDPR Compliance
1. Verify cookie banner implementation
2. Check data processing consent
3. Validate privacy policy links

### Content Security Policy
1. Check CSP headers for ads
2. Verify script sources are allowed
3. Test inline styles and scripts

## 📱 Mobile-Specific Issues

### Touch Targets
1. Verify minimum 44px touch targets
2. Check spacing between interactive elements
3. Test swipe gestures

### Performance on Mobile
1. Test on actual devices
2. Check network throttling
3. Verify offline functionality

## 🎨 UI/UX Troubleshooting

### Layout Issues
1. Test responsive breakpoints
2. Verify grid layouts on different screens
3. Check accessibility compliance

### Calculator Functionality
1. Test all calculation scenarios
2. Verify error handling for invalid inputs
3. Check result formatting

## 📊 Analytics Troubleshooting

### Google Analytics
1. Verify tracking ID is correct
2. Check event tracking implementation
3. Test goal conversions

### AdSense Issues
1. Verify ad unit IDs
2. Check ad placement compliance
3. Test AdBlock detection

---

**Troubleshooting Status:** ✅ Comprehensive guide covering all major issues and solutions for Next.js 15 + next-intl integration

**Critical Rule:** Always prefer simple solutions over complex ones. When in doubt, simplify the configuration until it works, then gradually add complexity only if needed.

# MathCalc Pro

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14+-000000?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-06B6D4?logo=tailwind-css)](https://tailwindcss.com/)

A comprehensive, multi-language calculator application with support for various mathematical operations, unit conversions, and financial calculations. Built with Next.js 14+ (App Router), TypeScript, Tailwind CSS, and next-intl for internationalization.

## 🏗 Project Structure

```
math-calc/
├── public/                  # Static files
│   ├── locales/             # Translation files
│   ├── images/              # Image assets
│   └── favicon.ico          # Favicon
├── src/
│   ├── app/                 # Next.js 14+ App Router
│   │   ├── [locale]/        # Localized routes
│   │   │   ├── (pages)/     # Application pages
│   │   │   └── layout.tsx   # Locale-specific layout
│   │   └── layout.tsx       # Root layout
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── ads/             # Ad components
│   │   └── calculators/     # Calculator components
│   ├── i18n/                # Internationalization
│   │   ├── locales/         # Translation files
│   │   └── utils/           # i18n utilities
│   ├── lib/                 # Utility functions
│   ├── styles/              # Global styles
│   └── types/               # TypeScript type definitions
├── .env.example             # Example environment variables
├── next.config.js           # Next.js configuration
├── package.json             # Project dependencies
└── tsconfig.json            # TypeScript configuration
```

## 🌟 Features

### 🧮 Calculator Types
- **Basic Operations**: Addition, subtraction, multiplication, division
- **Financial**: VAT, compound interest, loan payments, currency conversion
- **Unit Conversion**: Length, weight, volume, temperature, and more
- **Percentage**: Percentage of a number, percentage increase/decrease
- **Scientific**: Exponents, logarithms, trigonometric functions

### 🎨 User Interface
- 🌓 Dark/Light mode with system preference detection
- 📱 Fully responsive design
- 🌍 Built-in internationalization (i18n) with next-intl (CS, EN)
- 🚀 Optimized for performance with code splitting and lazy loading
- ♿ Accessible components (WAI-ARIA compliant)

### 🛠 Developer Experience
- 🔍 TypeScript for type safety
- 🧪 Comprehensive test coverage
- 📝 Well-documented code with JSDoc
- 🧩 Modular component architecture
- 🚀 Built-in analytics and monitoring

## 🛠 Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages following [Conventional Commits](https://www.conventionalcommits.org/)

### Component Development
1. Create components in `/src/components`
2. Use PascalCase for component filenames (e.g., `CalculatorDisplay.tsx`)
3. Export components as named exports
4. Include PropTypes or TypeScript interfaces
5. Add JSDoc comments for props and component purpose

### Testing
- Write unit tests with Jest and React Testing Library
- Place test files next to the tested component with `.test.tsx` extension
- Aim for good test coverage, especially for core functionality

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0.0 or later
- npm 10.x or later / yarn 1.22.x or later / pnpm 8.x or later
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/math-calc.git
   cd math-calc
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Update the `.env.local` file with your actual API keys and configuration.

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```
   The application will be available at [http://localhost:3000](http://localhost:3000)
   
   - English version: [http://localhost:3000/en](http://localhost:3000/en)
   - Czech version: [http://localhost:3000/cs](http://localhost:3000/cs)

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory based on the `.env.example` file. The following variables are supported:

```env
# Required for i18n
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_LOCALES=en,cs

# Google AdSense (optional)
NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX

# Google Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Tag Manager (optional)
NEXT_PUBLIC_GTM_ID=GTM-XXXXXX

# Feature flags (all optional, default to true)
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_ADS=true
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Check TypeScript types
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report

## 🌍 Internationalization (i18n)

The application uses `next-intl` for internationalization with the following structure:

```
/src
  /app
    /[locale]           # All routes are nested under the locale
      /(pages)          # Application pages
      layout.tsx        # Locale-specific layout
    layout.tsx          # Root layout with i18n provider
  /i18n
    /locales            # Translation files
      en.json           # English translations
      cs.json           # Czech translations
    /utils              # i18n utilities
      index.ts          # Utility functions
  /messages            # Auto-generated by next-intl
    en.json
    cs.json
```

### Adding a New Language

1. Add the new locale to `next.config.js`:
   ```javascript
   module.exports = {
     i18n: {
       locales: ['en', 'cs', 'es'], // Add new locale here
       defaultLocale: 'en',
     },
   };
   ```

2. Create a new translation file in `/src/i18n/locales/` (e.g., `es.json`)
3. Add translations for all keys used in the application
4. The new language will be automatically available at `/{locale}/`

### Using Translations in Components

```tsx
'use client';

import { useTranslations } from 'next-intl';

function MyComponent() {
  const t = useTranslations('common');
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

### Translation File Structure

Example `en.json`:
```json
{
  "common": {
    "welcome": "Welcome to MathCalc Pro",
    "description": "Your advanced calculator solution"
  },
  "calculator": {
    "basic": "Basic",
    "scientific": "Scientific",
    "financial": "Financial"
  }
}
```
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report

## 🏗 Project Structure

```
math-calc/
├── .github/               # GitHub workflows and templates
├── public/                # Static files
│   ├── locales/          # Translation files
│   └── images/           # Image assets
├── src/
│   ├── app/              # Next.js app router
│   │   ├── [locale]/     # Localized routes
│   │   └── api/          # API routes
│   ├── components/       # Reusable components
│   │   ├── ads/         # Ad components
│   │   ├── analytics/   # Analytics components
│   │   ├── calculators/ # Calculator components
│   │   ├── layout/      # Layout components
│   │   ├── theme/       # Theme components
│   │   └── ui/          # UI components (shadcn/ui)
│   ├── config/          # Configuration files
│   ├── lib/             # Utility functions
│   ├── styles/          # Global styles
│   └── types/           # TypeScript type definitions
├── tests/               # Test files
├── .env.example         # Example environment variables
├── .eslintrc.json       # ESLint configuration
├── .gitignore           # Git ignore file
├── next.config.js       # Next.js configuration
├── package.json         # Project dependencies
└── tsconfig.json        # TypeScript configuration
```

## 🌍 Internationalization (i18n)

The application supports multiple languages using Next.js internationalized routing and `next-intl`.

### Adding a New Language

1. Create a new folder in `public/locales/{locale}/` (e.g., `public/locales/de/`)
2. Copy the translation files from another language and translate the strings
3. Update the `locales` array in `src/i18n.ts`

### Using Translations

```tsx
import { useTranslations } from 'next-intl';

function MyComponent() {
  const t = useTranslations('common');
  return <h1>{t('welcome')}</h1>;
}
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Testing Libraries

- **Jest** - Test runner
- **React Testing Library** - Component testing
- **MSW** - API mocking
- **Jest DOM** - DOM testing utilities

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to a GitHub, GitLab, or Bitbucket repository
2. Import the repository on [Vercel](https://vercel.com/import)
3. Add your environment variables in the Vercel dashboard
4. Deploy!

### Other Platforms

Build the application for production:

```bash
npm run build
```

This will create an optimized production build in the `.next` folder.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautifully designed components
- [Lucide](https://lucide.dev/) - Beautiful & consistent icons
- [next-intl](https://next-intl-docs.vercel.app/) - Internationalization for Next.js

---

<p align="center">
  Made with ❤️ by MathCalc Pro Team
</p>
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   # Update the environment variables in .env.local
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run test coverage
npm run test:coverage
```

## 📚 Documentation

- [Coding Standards](/docs/CODING_STANDARDS.md) - Naming conventions and code style
- [Testing Strategy](/docs/requirements/testing-strategy.md) - Testing approach and best practices
- [Component Library](/docs/components/) - Documentation for UI components
- [Design System](/docs/design/) - Design specifications and guidelines

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) to get started.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
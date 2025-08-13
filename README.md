# MathCalc Pro - Comprehensive Math Calculator Suite

A modern, internationalized calculator application built with Next.js 15, featuring 20+ specialized calculators for Czech and international users.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Visit the application
open http://localhost:3000
```

## 📊 Project Overview

**MathCalc Pro** is a comprehensive suite of mathematical calculators designed for:
- **Educational use** - Students and teachers
- **Professional calculations** - Engineers, architects, financial analysts
- **Daily calculations** - Personal finance, health, conversions

### ✨ Key Features
- **20+ Specialized Calculators**: BMI, VAT, percentages, unit converters, financial tools
- **Multi-language Support**: Czech (primary), English, with internationalization ready
- **Responsive Design**: Mobile-first, works on all devices
- **SEO Optimized**: Server-side rendering with meta tags and structured data
- **Accessible**: WCAG 2.1 AA compliant
- **Modern Architecture**: Next.js 15, TypeScript, Tailwind CSS

## 🧮 Available Calculators

### Financial & Business
- **VAT Calculator** (`/dph`) - Tax calculations for Czech and EU
- **Net Salary Calculator** (`/cista-mzda`) - Czech payroll calculations
- **Compound Interest** - Investment growth calculations
- **Loan Calculator** - Mortgage and loan payments
- **ROI, NPV, IRR** - Investment analysis tools

### Health & Fitness
- **BMI Calculator** (`/bmi`) - Body Mass Index with health categories
- **BMR Calculator** - Basal Metabolic Rate
- **Calorie Calculator** - Daily caloric needs
- **Ideal Weight Calculator** - Target weight recommendations
- **Body Fat Calculator** - Body composition analysis

### Unit Converters
- **Length Converter** - Metric and imperial units
- **Weight Converter** - Mass conversions
- **Temperature Converter** - Celsius, Fahrenheit, Kelvin
- **Volume Converter** - Liquid and dry measurements

### Mathematics & Science
- **Percentage Calculator** - Various percentage operations
- **Fraction Calculator** - Fraction arithmetic and simplification
- **Rule of Three Calculator** - Proportional calculations
- **Area Calculator** - Geometric shapes
- **Volume Calculator** - 3D shapes

### Construction & Engineering
- **Material Calculator** - Construction material estimates
- **Concrete Calculator** - Concrete volume and materials
- **Insulation Calculator** - Building insulation requirements

### Everyday Tools
- **Tip Calculator** - Restaurant and service tips
- **Discount Calculator** - Sale prices and savings
- **Age Calculator** - Precise age calculations
- **Time Calculator** - Duration and time arithmetic
- **Fuel Calculator** - Trip costs and consumption

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Internationalization**: next-intl for multi-language support
- **Math Rendering**: KaTeX for mathematical formulas
- **SEO**: Structured data, meta tags, sitemap
- **Analytics**: Google Analytics, error tracking

## 📱 Responsive Design

Built mobile-first with adaptive layouts:
- **Mobile**: Touch-optimized calculators
- **Tablet**: Enhanced layouts with side panels
- **Desktop**: Full-featured interface with shortcuts

## 🌐 Internationalization

### Supported Languages
- **Czech (cs)** - Primary language
- **English (en)** - Full translation
- **Ready for expansion** - Polish, Slovak, Hungarian

### Localized Content
- All calculator interfaces
- Help text and examples
- Error messages
- SEO meta content

## 🏗️ Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   └── [locale]/          # Internationalized routes
│   │       └── calculator/    # Calculator pages
│   ├── components/
│   │   └── calculators/       # Calculator components
│   ├── messages/              # Translation files
│   │   ├── cs.json           # Czech translations
│   │   └── en.json           # English translations
│   └── lib/                   # Utilities and configurations
├── docs/                      # Comprehensive documentation
└── public/                    # Static assets
```

## 🚀 Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_id
NEXT_PUBLIC_ADSENSE_CLIENT_ID=your_adsense_id
```

## 📖 Documentation

### 📚 Essential Documentation
- **[Documentation Index](./docs/_INDEX.md)** - Complete navigation to all docs
- **[Project Documentation](./docs/README.md)** - Complete project guide
- **[Development Guide](./docs/development/README.md)** - Development principles
- **[Calculator Specifications](./docs/calculator-specification.md)** - Technical specs

### 🏗️ Development Resources
- **[Development Methodology](./docs/DEVELOPMENT_METHODOLOGY.md)** - Foundation-first approach
- **[Calculator Patterns](./docs/CALCULATOR_PATTERNS.md)** - Proven development patterns
- **[Design System](./docs/design-system.md)** - Complete design system
- **[Calculator Template](./docs/templates/calculator-template.md)** - Template for new calculators

### 🔧 Technical References
- **[API Documentation](./docs/reference/api-documentation.md)** - API reference
- **[Troubleshooting](./docs/development/troubleshooting-guide.md)** - Common issues
- **[Testing Guide](./docs/reference/testing-guide.md)** - Testing methodologies
- **[Coding Standards](./docs/reference/coding-standards.md)** - Code style guidelines

## 🤖 AI Development

This project is optimized for AI-assisted development:
- **Structured documentation** for Claude and similar models
- **Consistent coding patterns** for easy understanding
- **Comprehensive examples** in documentation
- **Clear separation of concerns**

See [CLAUDE.md](./CLAUDE.md) for AI-specific guidelines.

## 🧪 Testing

```bash
# Unit tests
npm test

# End-to-end tests
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📊 Performance

- **Lighthouse Score**: 95+ for all metrics
- **Core Web Vitals**: Optimized for LCP, FID, CLS
- **Bundle Size**: Optimized with code splitting
- **SEO**: 100% score with structured data

## 🔐 Security & Privacy

- **No data collection** for calculations
- **GDPR compliant** with minimal analytics
- **Secure** with no server-side data storage
- **Content Security Policy** implemented

## 📄 License

This project is proprietary software. All rights reserved.

## 🤝 Contributing

This project is currently closed-source. For feature requests or bug reports, please contact the development team.

## 📞 Support

- **Documentation**: Check the [docs folder](./docs/)
- **Issues**: Review [troubleshooting guide](./docs/development/troubleshooting-guide.md)
- **Contact**: Development team for commercial inquiries

---

**Built with ❤️ for Czech users and international community**
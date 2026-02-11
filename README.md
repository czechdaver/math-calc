# MathCalc Pro

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14+-000000?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwind-css)](https://tailwindcss.com/)

A comprehensive multi-language calculator application built with Next.js 14+ (App Router), TypeScript, Tailwind CSS, and next-intl for internationalization.

## Features

- **43 Calculators** across 9 categories
- **Multi-language support**: Czech (default), English, Slovak, Polish, Hungarian
- **Modern UI**: Dark/light mode, responsive design, shadcn/ui components
- **Real-time calculations**: Instant results as you type
- **SEO optimized**: Structured data, semantic HTML
- **Math formulas**: LaTeX rendering with KaTeX

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 14+ (App Router) | Framework, SSR, routing |
| React | 18+ (latest) | UI library |
| TypeScript | latest | Type safety |
| Tailwind CSS | 3.4 | Utility-first styling |
| shadcn/ui | latest | UI components (Radix UI primitives) |
| next-intl | 4.3.4 | Internationalization |
| next-themes | 0.4.6 | Dark/light mode |
| KaTeX + react-katex | 0.16 / 3.1 | LaTeX formulas |
| Framer Motion | 12.x | Animations |
| Lucide React | latest | Icons |

**Build:** `next build` (Webpack internally)
**Package manager:** npm
**Node.js:** >= 18.0.0

## Quick Start

### Prerequisites
- Node.js 18.0.0 or later
- npm 10.x or later

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/mathcalc-pro.git
cd mathcalc-pro

# Install dependencies
npm install

# Start development server
npm run dev
```

Application will be available at [http://localhost:3000](http://localhost:3000)

- Czech: http://localhost:3000/cs
- English: http://localhost:3000/en

### Verify Installation

```bash
# Check if server is running
curl -I http://localhost:3000/cs  # Should return 200 OK
```

### Environment Variables (Optional)

Create `.env.local` in root directory:

```env
# Google Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Tag Manager (optional)
NEXT_PUBLIC_GTM_ID=GTM-XXXXXX

# Google AdSense (optional)
NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX

# Feature flags (default: true)
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_ADS=true
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate coverage report |

## Calculator Overview

### Implemented Calculators (43 total)

| Category | Calculator | Route | Status | Notes |
|---|---|---|---|
| **Health & Fitness** | BMI Calculator | `/calculator/bmi-new/` | ✅ Reference impl. |
| | BMR Calculator | `/fitness-a-zdravi/kalkulacka-2/` | ✅ Modern |
| | Ideal Weight | `/fitness-a-zdravi/kalkulacka-3/` | ✅ Modern |
| | Body Fat Calculator | `/fitness-a-zdravi/kalkulacka-4/` | ✅ Modern |
| | Calories Calculator | `/fitness-a-zdravi/kalkulacka-1/` | ✅ Modern |
| | Placeholder | `/fitness-a-zdravi/kalkulacka-5/` | ⚠️ Placeholder |
| | Placeholder | `/fitness-a-zdravi/kalkulacka-6/` | ⚠️ Placeholder |
| **Practical** | Age Calculator | `/prakticke-vypocty/kalkulacka-1/` | ✅ Modern |
| | Time Calculator | `/prakticke-vypocty/kalkulacka-2/` | ✅ Modern |
| | Fuel Calculator | `/prakticke-vypocty/kalkulacka-3/` | ✅ Modern |
| | Discount Calculator | `/prakticke-vypocty/kalkulacka-4/` | ✅ Modern |
| | Tip Calculator | `/prakticke-vypocty/kalkulacka-5/` | ✅ Modern |
| | Loan Calculator | `/prakticke-vypocty/kalkulacka-6/` | ✅ Modern |
| **Finance (Extended)** | Annuity Payment | `/financie-rozsirene/anuitni-splatka/` | ⚠️ Old layout |
| | IRR Calculator | `/financie-rozsirene/irr/` | ✅ Modern |
| | NPV Calculator | `/financie-rozsirene/npv/` | ✅ Modern |
| | Early Repayment | `/financie-rozsirene/predcasne-splaceni/` | ✅ Modern |
| | ROI Calculator | `/financie-rozsirene/roi/` | ✅ Modern |
| | Compound Interest | `/financie-rozsirene/slozene-uroceni/` | ⚠️ Old layout |
| **Construction** | Concrete Calculator | `/stavebni/beton/` | ✅ Modern |
| | Insulation Calculator | `/stavebni/izolace/` | ✅ Modern |
| | Material Calculator | `/stavebni/materialy/` | ✅ Modern |
| | Volume Calculator | `/stavebni/objem/` | ✅ Modern |
| | Area Calculator | `/stavebni/plocha/` | ✅ Modern |
| **Percentages** | Percentage of Number | `/procenta/procento-z-cisla/` | ✅ Modern |
| | What % is X of Y | `/procenta/kolik-procent-je-x-z-y/` | ⚠️ Mixed layout |
| | Y is X%, what is 100% | `/procenta/y-je-x-kolik-je-sto/` | ✅ Modern |
| **Rule of Three** | Direct Proportion | `/trojclenka/prima-umera/` | ⚠️ Old layout |
| | Inverse Proportion | `/trojclenka/neprima-umera/` | ⚠️ Old layout |
| **Fractions** | Fractions Calculator | `/zlomky/` | ⚠️ Old layout |
| **VAT** | VAT Calculator | `/dph/` | ✅ Modern |
| **Net Salary** | Net Salary Calculator | `/cista-mzda/` | ⚠️ Old layout |
| **Unit Converter** | Unit Converter | `/prevodnik-jednotek/` | ⚠️ Old layout |
| **Currency** | Currency Calculator | `/currency/` | ✅ Modern |
| **Fraction Operations** | Addition | `/zlomky/scitani/` | ✅ Modern |
| | Subtraction | `/zlomky/odcitani/` | ✅ Modern |
| | Multiplication | `/zlomky/nasobeni/` | ✅ Modern |
| | Division | `/zlomky/deleni/` | ✅ Modern |
| | Simplification | `/zlomky/zjednoduseni/` | ✅ Modern |
| | Conversion | `/zlomky/premeny/` | ✅ Modern |
| **Unit Converters** | Length Converter | `/prevodnik-jednotek/delka/` | ✅ Modern |
| | Temperature Converter | `/prevodnik-jednotek/teplota/` | ✅ Modern |
| | Volume Converter | `/prevodnik-jednotek/objem/` | ✅ Modern |
| | Weight Converter | `/prevodnik-jednotek/vaha/` | ✅ Modern |

**Legend:**
- ✅ Modern = Uses `SimpleCalculatorLayout` with all features
- ⚠️ Old Layout = Uses legacy `CalculatorBase` or mixed patterns
- ⚠️ Placeholder = Generic placeholder to be implemented

### Known Issues

1. **Duplicate Routes**: 10 calculator pairs have both original and `-new` versions (bmi/bmi-new, dph/dph-new, etc.)
2. **Legacy Layouts**: 8 calculators still use old `CalculatorBase` pattern
3. **Incomplete Translations**: Only cs and en have full translations; sk, pl, hu only have common.json

## Project Structure

```
src/
├── app/
│   ├── [locale]/              # Localized routes (cs, en, sk, pl, hu)
│   │   ├── calculator/        # All calculator routes
│   │   │   ├── bmi-new/
│   │   │   ├── dph/
│   │   │   ├── procenta/
│   │   │   └── ...
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── api/                 # API routes
├── components/
│   ├── calculators/           # Calculator components (43 total)
│   │   ├── shared/            # Shared components
│   │   ├── fractionOperations/
│   │   └── unitConverters/
│   ├── layout/                # Layout components
│   │   └── SimpleCalculatorLayout.tsx
│   └── ui/                    # shadcn/ui components
├── lib/                     # Utilities
│   └── calculatorDataUtils.ts
├── messages/                 # Translations (cs.json, en.json)
└── styles/
```

## Documentation

- [Architecture](docs/architecture.md) - Project architecture and data flow
- [Calculator Template](docs/calculator-template.md) - How to create a new calculator
- [Refactoring Guide](docs/refactoring-guide.md) - Current state and refactoring priorities
- [Development Docs](docs/) - Complete documentation index

## Contributing

Contributions are welcome! Please read the documentation first.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautifully designed components
- [Lucide](https://lucide.dev/) - Beautiful & consistent icons
- [next-intl](https://next-intl-docs.vercel.app/) - Internationalization for Next.js
- [KaTeX](https://katex.org/) - LaTeX rendering

---

Made with ❤️ by MathCalc Pro Team

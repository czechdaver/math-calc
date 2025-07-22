# Math Calculator Pro

A modern, responsive calculator application with advanced mathematical functions, unit conversion, and financial calculations. Built with Next.js, TypeScript, and shadcn/ui.

## 🚀 Features

- **Multiple Calculator Types**:
  - Basic arithmetic
  - Financial calculations (VAT, compound interest, loan payments)
  - Unit conversion
  - Percentage calculations
  - And more...

- **Modern UI**:
  - Responsive design
  - Dark/light mode
  - Accessible components
  - Animated transitions

- **Developer Friendly**:
  - TypeScript support
  - Comprehensive test coverage
  - Clean, maintainable codebase
  - Documentation

## 📦 Project Structure

```
src/
├── app/                    # Next.js app router pages
├── components/             # Reusable UI components
│   ├── calculators/       # Calculator components
│   └── ui/                # shadcn/ui components
├── lib/                    # Utility functions and config
├── styles/                 # Global styles and themes
└── utils/                 # Helper functions and hooks
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/math-calc.git
   cd math-calc
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
---
title: Development Guide
category: Getting Started
version: 1.2.0
updated: 2025-07-23
---

# Development Guide

## Project Structure

```
src/
├── app/                    # Next.js app router pages
├── components/            # Reusable UI components
│   ├── calculators/       # Calculator components
│   └── ui/                # shadcn/ui components
├── lib/                   # Utility functions and config
├── styles/                # Global styles and themes
└── utils/                 # Helper functions and hooks
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run linter
- `npm run format` - Format code with Prettier
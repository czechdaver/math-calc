# UI Style Guide

## Design System Overview

### Color Palette

#### Primary Colors
- Primary: `#3B82F6` (Blue-500)
- Primary Dark: `#2563EB` (Blue-600)
- Primary Light: `#60A5FA` (Blue-400)

#### Semantic Colors
- Success: `#10B981` (Green-500)
- Warning: `#F59E0B` (Amber-500)
- Error: `#EF4444` (Red-500)
- Info: `#3B82F6` (Blue-500)

#### Neutral Colors
- Gray 50: `#F9FAFB`
- Gray 100: `#F3F4F6`
- Gray 200: `#E5E7EB`
- Gray 300: `#D1D5DB`
- Gray 400: `#9CA3AF`
- Gray 500: `#6B7280`
- Gray 600: `#4B5563`
- Gray 700: `#374151`
- Gray 800: `#1F2937`
- Gray 900: `#111827`

### Typography

#### Font Family
- Primary: `Inter`, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
- Monospace: `JetBrains Mono`, SFMono-Regular, Menlo, Monaco, Consolas, monospace

#### Font Sizes
- Display: `4.5rem` (72px)
- Heading 1: `3rem` (48px)
- Heading 2: `2.25rem` (36px)
- Heading 3: `1.5rem` (24px)
- Body Large: `1.25rem` (20px)
- Body: `1rem` (16px)
- Small: `0.875rem` (14px)
- X-Small: `0.75rem` (12px)

#### Font Weights
- Light: 300
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

### Spacing
- Base unit: `0.25rem` (4px)
- Spacing scale:
  - `0`: 0
  - `1`: 0.25rem (4px)
  - `2`: 0.5rem (8px)
  - `3`: 0.75rem (12px)
  - `4`: 1rem (16px)
  - `5`: 1.25rem (20px)
  - `6`: 1.5rem (24px)
  - `8`: 2rem (32px)
  - `10`: 2.5rem (40px)
  - `12`: 3rem (48px)
  - `16`: 4rem (64px)
  - `20`: 5rem (80px)

### Border Radius
- None: `0`
- Sm: `0.125rem` (2px)
- Base: `0.25rem` (4px)
- Md: `0.375rem` (6px)
- Lg: `0.5rem` (8px)
- Xl: `0.75rem` (12px)
- 2xl: `1rem` (16px)
- Full: `9999px`

### Shadows
- Sm: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- Base: `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)`
- Md: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
- Lg: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`
- Xl: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`

## UI Components

### Buttons

#### Primary Button
```jsx
<button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
  Button Text
</button>
```

#### Secondary Button
```jsx
<button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
  Button Text
</button>
```

#### Ghost Button
```jsx
<button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
  Button Text
</button>
```

### Form Elements

#### Text Input
```jsx
<div className="mb-4">
  <label htmlFor="input-id" className="block text-sm font-medium text-gray-700 mb-1">
    Label
  </label>
  <input
    type="text"
    id="input-id"
    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
    placeholder="Placeholder"
  />
  <p className="mt-1 text-sm text-gray-500">Help text</p>
</div>
```

#### Select
```jsx
<div className="mb-4">
  <label htmlFor="select-id" className="block text-sm font-medium text-gray-700 mb-1">
    Label
  </label>
  <select
    id="select-id"
    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
  >
    <option>Option 1</option>
    <option>Option 2</option>
  </select>
</div>
```

### Cards

#### Basic Card
```jsx
<div className="bg-white overflow-hidden shadow rounded-lg">
  <div className="px-4 py-5 sm:p-6">
    <h3 className="text-lg leading-6 font-medium text-gray-900">Card Title</h3>
    <div className="mt-2 max-w-xl text-sm text-gray-500">
      <p>Card content goes here.</p>
    </div>
    <div className="mt-4">
      <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        Button
      </button>
    </div>
  </div>
</div>
```

### Alerts

#### Success Alert
```jsx
<div className="rounded-md bg-green-50 p-4">
  <div className="flex">
    <div className="flex-shrink-0">
      <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
    </div>
    <div className="ml-3">
      <p className="text-sm font-medium text-green-800">Success message goes here</p>
    </div>
  </div>
</div>
```

### Navigation

#### Main Navigation
```jsx
<nav className="bg-white shadow">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between h-16">
      <div className="flex">
        <div className="flex-shrink-0 flex items-center">
          <span className="text-xl font-bold text-blue-600">MathCalc Pro</span>
        </div>
        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
          <a href="#" className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
            Home
          </a>
          <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
            Calculators
          </a>
        </div>
      </div>
    </div>
  </div>
</nav>
```

## Responsive Design

### Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Example: Responsive Grid
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {/* Grid items */}
</div>
```

## Dark Mode

Use the `dark:` prefix to apply styles in dark mode:

```jsx
<div className="bg-white dark:bg-gray-800">
  <h1 className="text-gray-900 dark:text-white">Dark Mode Example</h1>
</div>
```

## Animation

### Transitions
```jsx
<button className="transition duration-150 ease-in-out transform hover:scale-105">
  Hover me
</button>
```

### Keyframe Animations
Add to your Tailwind config:
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
      },
    },
  },
};
```

## Accessibility

### Focus States
```jsx
<button className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
  Accessible Button
</button>
```

### Screen Reader Only
```jsx
<span className="sr-only">Information:</span>
```

## Icons

Use Heroicons v2:

```jsx
import { HomeIcon } from '@heroicons/react/24/outline';

<HomeIcon className="h-6 w-6 text-gray-500" />
```

## Best Practices

1. **Consistent Spacing**: Use the spacing scale consistently
2. **Semantic HTML**: Use appropriate HTML elements
3. **Responsive Design**: Test on all breakpoints
4. **Accessibility**: Follow WCAG guidelines
5. **Performance**: Optimize images and assets
6. **Documentation**: Document custom components and patterns

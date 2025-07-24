---
title: Loading Spinner
category: Components
version: 1.2.0
updated: 2025-07-23
---

# LoadingSpinner Component

A customizable loading spinner component with optional label and overlay, built with accessibility in mind and following shadcn/ui design patterns.

## Features

- Multiple size variants (xs, sm, md, lg, xl)
- Color variants (primary, muted, destructive, success, warning, info)
- Optional label with configurable position (top, bottom, left, right)
- Fullscreen mode
- Overlay with optional blur effect
- Accessible with proper ARIA attributes
- TypeScript support

## Installation

The LoadingSpinner component is part of the UI components library and is available at `@/components/ui/LoadingSpinner`.

## Usage

### Basic Usage

```tsx
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

function Example() {
  return <LoadingSpinner />;
}
```

### With Label

```tsx
<LoadingSpinner 
  label="Loading data..."
  labelPosition="right"
  size="md"
  color="primary"
/>
```

### Fullscreen with Overlay

```tsx
<LoadingSpinner 
  fullScreen 
  overlay 
  overlayBlur 
  label="Loading application..."
  size="lg"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size of the spinner |
| `color` | `'primary' \| 'muted' \| 'destructive' \| 'success' \| 'warning' \| 'info'` | `'primary'` | Color variant of the spinner |
| `label` | `string` | - | Optional label text to display with the spinner |
| `labelPosition` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'right'` | Position of the label relative to the spinner |
| `fullScreen` | `boolean` | `false` | Whether to take up the full viewport |
| `overlay` | `boolean` | `false` | Whether to show an overlay behind the spinner |
| `overlayBlur` | `boolean` | `true` | Whether to blur the overlay background |
| `className` | `string` | - | Additional class names for the spinner |
| `labelClassName` | `string` | - | Additional class names for the label |
| `overlayClassName` | `string` | - | Additional class names for the overlay |

## Accessibility

The LoadingSpinner component includes the following accessibility features:

- `role="status"` to indicate a status message to screen readers
- `aria-label="Loading..."` when no label is provided
- Proper focus management
- High contrast colors for better visibility

## Best Practices

1. **Provide Context**: Always include a label when the loading state might take more than a couple of seconds.
2. **Use Appropriate Size**: Choose a size that matches the context (e.g., use smaller spinners in buttons, larger ones for full-page loads).
3. **Color Contrast**: Ensure there's sufficient contrast between the spinner and its background.
4. **Avoid Multiple Spinners**: Show only one loading spinner at a time to avoid confusion.
5. **Consider Progress Indicators**: For operations with known durations, consider using a progress bar instead.

## Examples

### Inline Loading

```tsx
<Button disabled>
  <LoadingSpinner size="sm" className="mr-2" />
  Processing...
</Button>
```

### Page Loading

```tsx
<LoadingSpinner 
  fullScreen 
  overlay 
  label="Loading your dashboard..." 
  size="lg"
  color="primary"
/>
```

### Custom Styling

```tsx
<LoadingSpinner 
  className="border-t-purple-500 border-r-purple-500/20"
  labelClassName="text-purple-600 font-medium"
  overlayClassName="bg-purple-50/80"
  label="Processing payment..."
  size="xl"
/>
```

## Related Components

- [Button](../components/ui/Button) - For buttons with loading states
- [Skeleton](../components/ui/Skeleton) - For content loading placeholders
- [Progress](../components/ui/Progress) - For showing progress of known durations

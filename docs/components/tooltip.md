# Tooltip Component

A customizable tooltip component built on top of shadcn/ui's Tooltip, providing a simple API with additional features like variants and custom styling.

## Features

- Multiple positioning options (top, right, bottom, left)
- Visual variants (default, light, dark, primary, success, warning, error)
- Configurable delay and duration
- Interactive mode (tooltip stays open when hovering over it)
- Maximum width control
- Accessible with keyboard navigation
- Built-in animations
- TypeScript support

## Installation

The Tooltip component is part of the UI components library and is available at `@/components/ui/Tooltip`.

## Basic Usage

### Simple Tooltip

```tsx
import { Tooltip } from '@/components/ui/Tooltip';

function Example() {
  return (
    <Tooltip content="This is a tooltip">
      <button>Hover me</button>
    </Tooltip>
  );
}
```

### With Custom Position and Variant

```tsx
<Tooltip 
  content="This is a success tooltip"
  position="right"
  variant="success"
  delay={200}
  maxWidth={250}
>
  <button>Hover me</button>
</Tooltip>
```

### Interactive Tooltip

```tsx
<Tooltip 
  content={
    <div>
      <h4 className="font-semibold">Interactive Tooltip</h4>
      <p>This tooltip stays open when you hover over it.</p>
      <button className="mt-2 text-sm text-blue-500 hover:underline">
        Click me
      </button>
    </div>
  }
  interactive
  className="w-64 p-4"
>
  <button>Hover for interactive tooltip</button>
</Tooltip>
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `React.ReactNode` | - | The content to display in the tooltip (required) |
| `children` | `React.ReactElement` | - | The element that triggers the tooltip (required) |
| `position` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | Position of the tooltip relative to the trigger |
| `variant` | `'default' \| 'light' \| 'dark' \| 'primary' \| 'success' \| 'warning' \| 'error'` | `'default'` | Visual style variant |
| `delay` | `number` | `100` | Delay in milliseconds before showing the tooltip |
| `disabled` | `boolean` | `false` | Whether the tooltip is disabled |
| `className` | `string` | - | Additional class names for the tooltip trigger |
| `contentClassName` | `string` | - | Additional class names for the tooltip content |
| `interactive` | `boolean` | `false` | Whether the tooltip should stay open when hovering over it |
| `maxWidth` | `number` | `200` | Maximum width of the tooltip in pixels |

### Variants

| Variant | Description |
|---------|-------------|
| `default` | Default style with subtle border |
| `light` | Light background with border |
| `dark` | Dark background |
| `primary` | Primary brand color |
| `success` | Green variant for success messages |
| `warning` | Yellow variant for warnings |
| `error` | Red variant for errors |

## Advanced Usage

### Using the Underlying Components

For more advanced use cases, you can use the underlying shadcn components directly:

```tsx
import { 
  TooltipRoot, 
  TooltipTrigger, 
  TooltipContent, 
  TooltipProvider 
} from '@/components/ui/Tooltip';

function AdvancedExample() {
  return (
    <TooltipProvider>
      <TooltipRoot>
        <TooltipTrigger asChild>
          <button>Hover me</button>
        </TooltipTrigger>
        <TooltipContent className="bg-blue-600 text-white">
          Custom styled tooltip
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  );
}
```

### Controlled Tooltip

```tsx
import { useState } from 'react';
import { TooltipRoot, TooltipTrigger, TooltipContent } from '@/components/ui/Tooltip';

function ControlledTooltip() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TooltipRoot open={isOpen} onOpenChange={setIsOpen}>
      <TooltipTrigger asChild>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? 'Hide' : 'Show'} Tooltip
        </button>
      </TooltipTrigger>
      <TooltipContent>
        This is a controlled tooltip
      </TooltipContent>
    </TooltipRoot>
  );
}
```

## Best Practices

1. **Keep it Short**: Tooltips should be concise and to the point.
2. **Be Descriptive**: Make sure the tooltip provides useful information.
3. **Use Appropriate Variants**: Choose a variant that matches the context (e.g., error variant for error messages).
4. **Consider Mobile**: Ensure tooltips are accessible on touch devices.
5. **Don't Overuse**: Only use tooltips for supplementary information, not critical content.

## Accessibility

The Tooltip component includes the following accessibility features:

- Keyboard navigation support
- Proper ARIA attributes
- Focus management
- Screen reader support
- Respects reduced motion preferences

## Customization

### Styling with CSS Variables

You can customize the tooltip appearance using CSS variables:

```css
:root {
  --tooltip-bg: #1a1a1a;
  --tooltip-text: #ffffff;
  --tooltip-border: #333333;
  --tooltip-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --tooltip-radius: 0.375rem;
  --tooltip-padding: 0.5rem 0.75rem;
}
```

### Custom Animation

You can customize the animation by overriding the default animation classes:

```tsx
<Tooltip 
  content="Custom animation"
  contentClassName="animate-in slide-in-from-bottom-2 duration-200"
>
  <button>Hover me</button>
</Tooltip>
```

## Related Components

- [Popover](../components/ui/Popover) - For more complex content that needs to be shown on demand
- [HoverCard](../components/ui/HoverCard) - For card-style hover content
- [Dialog](../components/ui/Dialog) - For modal dialogs and alerts

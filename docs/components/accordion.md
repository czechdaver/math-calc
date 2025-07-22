# Accordion Component

A flexible and accessible accordion component built on top of shadcn/ui's Accordion, providing multiple visual variants and customization options for collapsible content sections.

## Features

- Multiple visual variants (default, bordered, filled, separated)
- Support for single or multiple open items
- Customizable icons for open/close states
- Keyboard navigation
- Responsive design
- TypeScript support
- Accessible with proper ARIA attributes
- Smooth animations
- Support for controlled and uncontrolled usage

## Installation

The Accordion component is part of the UI components library and is available at `@/components/ui/Accordion`.

## Basic Usage

### Simple Accordion

```tsx
import { Accordion } from '@/components/ui/Accordion';

function Example() {
  return (
    <Accordion>
      <Accordion.Item title="Item 1">
        <p>Content for item 1</p>
      </Accordion.Item>
      <Accordion.Item title="Item 2">
        <p>Content for item 2</p>
      </Accordion.Item>
    </Accordion>
  );
}
```

### With Icons and Customization

```tsx
import { Accordion } from '@/components/ui/Accordion';
import { Plus, Minus } from 'lucide-react';

function Example() {
  return (
    <Accordion 
      variant="bordered"
      iconClosed={<Plus className="h-4 w-4" />}
      iconOpened={<Minus className="h-4 w-4" />}
    >
      <Accordion.Item title="How does it work?">
        <p>This is a detailed explanation of how it works.</p>
      </Accordion.Item>
      <Accordion.Item 
        title="Frequently Asked Questions"
        defaultOpen
      >
        <p>Common questions and answers go here.</p>
      </Accordion.Item>
    </Accordion>
  );
}
```

## Variants

### Default

```tsx
<Accordion variant="default">
  <Accordion.Item title="Default Item">
    <p>Content goes here</p>
  </Accordion.Item>
</Accordion>
```

### Bordered

```tsx
<Accordion variant="bordered">
  <Accordion.Item title="Bordered Item">
    <p>Content with border around each item</p>
  </Accordion.Item>
</Accordion>
```

### Filled

```tsx
<Accordion variant="filled">
  <Accordion.Item title="Filled Item">
    <p>Content with filled background</p>
  </Accordion.Item>
</Accordion>
```

### Separated

```tsx
<Accordion variant="separated">
  <Accordion.Item title="Separated Item">
    <p>Content with separation between items</p>
  </Accordion.Item>
</Accordion>
```

## API Reference

### Accordion Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `activeItems` | `string \| string[]` | - | The active item ID or array of IDs (controlled mode) |
| `onChange` | `(activeItems: string[]) => void` | - | Callback when the active items change (controlled mode) |
| `allowMultiple` | `boolean` | `false` | Whether multiple items can be open at once |
| `variant` | `'default' \| 'bordered' \| 'filled' \| 'separated'` | `'default'` | Visual style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the accordion items |
| `className` | `string` | - | Additional class name for the accordion container |
| `showChevron` | `boolean` | `true` | Whether to show a chevron icon |
| `iconClosed` | `React.ReactNode` | `<ChevronDown />` | Custom icon to display when an accordion is closed |
| `iconOpened` | `React.ReactNode` | `<ChevronUp />` | Custom icon to display when an accordion is open |
| `showDivider` | `boolean` | `true` | Whether to show a divider between accordion items |
| `animate` | `boolean` | `true` | Whether to animate the accordion content |
| `children` | `React.ReactNode` | - | Accordion items |

### Accordion.Item Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `React.ReactNode` | - | The title of the accordion item (required) |
| `children` | `React.ReactNode` | - | The content of the accordion item (required) |
| `disabled` | `boolean` | `false` | Whether the accordion item is disabled |
| `defaultOpen` | `boolean` | `false` | Whether the accordion item is open by default |
| `className` | `string` | - | Additional class name for the accordion item |
| `headerClassName` | `string` | - | Additional class name for the accordion header |
| `contentClassName` | `string` | - | Additional class name for the accordion content |
| `showChevron` | `boolean` | `true` | Whether to show a chevron icon |
| `iconClosed` | `React.ReactNode` | - | Custom icon to display when the accordion is closed |
| `iconOpened` | `React.ReactNode` | - | Custom icon to display when the accordion is open |
| `onOpen` | `() => void` | - | Callback when the accordion item is opened |
| `onClose` | `() => void` | - | Callback when the accordion item is closed |

## Advanced Usage

### Controlled Accordion

```tsx
import { useState } from 'react';
import { Accordion } from '@/components/ui/Accordion';

function ControlledAccordion() {
  const [activeItems, setActiveItems] = useState<string[]>(['item-1']);

  return (
    <Accordion 
      activeItems={activeItems}
      onChange={setActiveItems}
      allowMultiple
    >
      <Accordion.Item _id="item-1" title="Item 1">
        <p>Content 1</p>
      </Accordion.Item>
      <Accordion.Item _id="item-2" title="Item 2">
        <p>Content 2</p>
      </Accordion.Item>
    </Accordion>
  );
}
```

### Custom Icons and Styling

```tsx
<Accordion 
  variant="bordered"
  iconClosed={<Plus className="h-4 w-4" />}
  iconOpened={<Minus className="h-4 w-4" />}
  className="max-w-2xl mx-auto"
>
  <Accordion.Item 
    title="Custom Styled Item"
    headerClassName="hover:bg-blue-50"
    contentClassName="bg-blue-50 rounded-b"
  >
    <p>Custom content with additional styling</p>
  </Accordion.Item>
</Accordion>
```

### Disabled Item

```tsx
<Accordion>
  <Accordion.Item title="Active Item">
    <p>This item is active</p>
  </Accordion.Item>
  <Accordion.Item title="Disabled Item" disabled>
    <p>This item is disabled</p>
  </Accordion.Item>
</Accordion>
```

## Styling

### Customizing with CSS Variables

You can customize the appearance of the accordion using CSS variables:

```css
:root {
  --accordion-border-color: #e2e8f0;
  --accordion-bg: #ffffff;
  --accordion-hover-bg: #f8fafc;
  --accordion-text-color: #1e293b;
  --accordion-transition: all 0.2s ease;
}
```

### Using Class Names

You can also customize the appearance by passing class names to the various parts of the component:

```tsx
<Accordion className="custom-accordion">
  <Accordion.Item 
    title="Custom Item"
    className="custom-item"
    headerClassName="custom-header"
    contentClassName="custom-content"
  >
    <p>Custom content</p>
  </Accordion.Item>
</Accordion>
```

## Accessibility

The Accordion component includes the following accessibility features:

- Keyboard navigation (Enter/Space to toggle, Arrow keys for navigation)
- ARIA attributes for screen readers
- Focus management
- Proper heading hierarchy
- Support for reduced motion

## Best Practices

1. **Clear Headings**: Use clear and descriptive titles for each accordion item.
2. **Logical Grouping**: Group related content under appropriate accordion items.
3. **Avoid Nesting**: Avoid nesting accordions within accordions as it can be confusing.
4. **Mobile Consideration**: Ensure accordions are easily tappable on touch devices.
5. **Performance**: For large amounts of content, consider lazy loading the content when the accordion is opened.

## Related Components

- [Tabs](../components/ui/Tabs) - For tabbed navigation between multiple panels
- [Collapsible](../components/ui/Collapsible) - For a simple show/hide component
- [Disclosure](../components/ui/Disclosure) - For a simple disclosure widget

# Tabs Component

A flexible and accessible tabs component built on top of shadcn/ui's Tabs, providing multiple visual variants and customization options.

## Features

- Multiple visual variants (default, pills, underline, segmented)
- Responsive design
- Keyboard navigation
- Support for icons and badges
- Controlled and uncontrolled modes
- Customizable sizes and styles
- TypeScript support
- Accessible with proper ARIA attributes

## Installation

The Tabs component is part of the UI components library and is available at `@/components/ui/Tabs`.

## Basic Usage

### Simple Tabs

```tsx
import { Tabs } from '@/components/ui/Tabs';

function Example() {
  return (
    <Tabs>
      <Tabs.Item label="Tab 1">Content 1</Tabs.Item>
      <Tabs.Item label="Tab 2">Content 2</Tabs.Item>
      <Tabs.Item label="Tab 3">Content 3</Tabs.Item>
    </Tabs>
  );
}
```

### With Icons and Badges

```tsx
import { Tabs } from '@/components/ui/Tabs';
import { Home, Settings, User } from 'lucide-react';

function Example() {
  return (
    <Tabs>
      <Tabs.Item 
        label="Home" 
        icon={<Home className="h-4 w-4" />}
      >
        Home Content
      </Tabs.Item>
      <Tabs.Item 
        label="Profile" 
        icon={<User className="h-4 w-4" />}
        badge="New"
      >
        Profile Content
      </Tabs.Item>
      <Tabs.Item 
        label="Settings" 
        icon={<Settings className="h-4 w-4" />}
        disabled
      >
        Settings Content
      </Tabs.Item>
    </Tabs>
  );
}
```

## Variants

### Default

```tsx
<Tabs variant="default">
  <Tabs.Item label="Tab 1">Content 1</Tabs.Item>
  <Tabs.Item label="Tab 2">Content 2</Tabs.Item>
</Tabs>
```

### Pills

```tsx
<Tabs variant="pills">
  <Tabs.Item label="Tab 1">Content 1</Tabs.Item>
  <Tabs.Item label="Tab 2">Content 2</Tabs.Item>
</Tabs>
```

### Underline

```tsx
<Tabs variant="underline">
  <Tabs.Item label="Tab 1">Content 1</Tabs.Item>
  <Tabs.Item label="Tab 2">Content 2</Tabs.Item>
</Tabs>
```

### Segmented

```tsx
<Tabs variant="segmented">
  <Tabs.Item label="Tab 1">Content 1</Tabs.Item>
  <Tabs.Item label="Tab 2">Content 2</Tabs.Item>
</Tabs>
```

## API Reference

### Tabs Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `activeTab` | `string` | - | The ID of the currently active tab (controlled mode) |
| `onChange` | `(tabId: string) => void` | - | Callback when the active tab changes |
| `variant` | `'default' \| 'pills' \| 'underline' \| 'segmented'` | `'default'` | Visual style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the tab buttons |
| `fullWidth` | `boolean` | `false` | Whether tabs should fill the available width |
| `className` | `string` | - | Additional class name for the root element |
| `tabListClassName` | `string` | - | Additional class name for the tab list |
| `panelsClassName` | `string` | - | Additional class name for the tab panels container |
| `header` | `React.ReactNode` | - | Content to display above the tabs |
| `footer` | `React.ReactNode` | - | Content to display below the panels |
| `keepMounted` | `boolean` | `false` | Whether to keep inactive tab panels mounted |
| `children` | `React.ReactNode` | - | Tab items |

### TabItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `React.ReactNode` | - | The label to display for the tab (required) |
| `children` | `React.ReactNode` | - | The content to display when the tab is active (required) |
| `disabled` | `boolean` | `false` | Whether the tab is disabled |
| `icon` | `React.ReactNode` | - | Optional icon to display before the label |
| `badge` | `React.ReactNode` | - | Optional badge to display after the label |
| `panelClassName` | `string` | - | Additional class name for the tab panel |
| `className` | `string` | - | Additional class name for the tab button |
| `_id` | `string` | - | Tab ID (automatically generated if not provided) |

## Advanced Usage

### Controlled Tabs

```tsx
import { useState } from 'react';
import { Tabs } from '@/components/ui/Tabs';

function ControlledTabs() {
  const [activeTab, setActiveTab] = useState('tab1');

  return (
    <Tabs 
      activeTab={activeTab}
      onChange={setActiveTab}
    >
      <Tabs.Item _id="tab1" label="Tab 1">Content 1</Tabs.Item>
      <Tabs.Item _id="tab2" label="Tab 2">Content 2</Tabs.Item>
    </Tabs>
  );
}
```

### Full-Width Tabs

```tsx
<Tabs fullWidth>
  <Tabs.Item label="Tab 1">Content 1</Tabs.Item>
  <Tabs.Item label="Tab 2">Content 2</Tabs.Item>
  <Tabs.Item label="Tab 3">Content 3</Tabs.Item>
</Tabs>
```

### With Header and Footer

```tsx
<Tabs 
  header={
    <div className="p-4 bg-gray-50 rounded-t-lg">
      <h2 className="text-xl font-semibold">Tabbed Interface</h2>
    </div>
  }
  footer={
    <div className="p-4 bg-gray-50 rounded-b-lg text-sm text-gray-500">
      Showing 1-3 of 10 items
    </div>
  }
>
  <Tabs.Item label="Tab 1">Content 1</Tabs.Item>
  <Tabs.Item label="Tab 2">Content 2</Tabs.Item>
</Tabs>
```

## Styling

### Customizing with CSS Variables

You can customize the appearance of the tabs using CSS variables:

```css
:root {
  --tabs-trigger-color: hsl(240, 3.7%, 15.9%);
  --tabs-trigger-hover-color: hsl(240, 4.8%, 95.9%);
  --tabs-trigger-active-color: hsl(0, 0%, 100%);
  --tabs-trigger-active-bg: hsl(221.2, 83.2%, 53.3%);
  --tabs-trigger-disabled-opacity: 0.5;
  --tabs-indicator-size: 2px;
  --tabs-indicator-color: var(--tabs-trigger-active-bg);
}
```

### Using Class Names

You can also customize the appearance by passing class names to the various parts of the component:

```tsx
<Tabs 
  className="custom-tabs"
  tabListClassName="custom-tablist"
  panelsClassName="custom-panels"
>
  <Tabs.Item 
    label="Tab 1" 
    className="custom-tab"
    panelClassName="custom-panel"
  >
    Content 1
  </Tabs.Item>
</Tabs>
```

## Accessibility

The Tabs component includes the following accessibility features:

- Keyboard navigation (arrow keys, Home, End)
- ARIA attributes for screen readers
- Focus management
- Proper tab order
- Support for reduced motion

## Best Practices

1. **Keep Labels Short**: Tab labels should be concise and descriptive.
2. **Use Icons Sparingly**: Icons can enhance usability but don't overuse them.
3. **Consider Mobile**: Ensure tabs are easily tappable on touch devices.
4. **Logical Grouping**: Group related content under appropriate tabs.
5. **Default Selection**: Always have a tab selected by default.

## Related Components

- [Accordion](../components/ui/Accordion) - For vertically stacked, collapsible content
- [Navigation Menu](../components/ui/NavigationMenu) - For site navigation with dropdown menus
- [Dialog](../components/ui/Dialog) - For modal dialogs and overlays

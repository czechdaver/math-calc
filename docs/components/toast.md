# Toast Component

A flexible and accessible toast notification system built on top of [Sonner](https://sonner.emilkowal.ski/), following shadcn/ui design patterns. This component provides a simple API for displaying temporary, non-intrusive notifications to users.

## Features

- Multiple variants: success, error, warning, info, and default
- Promise-based loading states
- Customizable duration and actions
- Keyboard accessible
- Built-in animations
- Support for dark/light themes
- TypeScript support

## Installation

The Toast component is part of the UI components library and is available at `@/components/ui/Toast`.

## Basic Usage

### 1. Add the Toaster to your app

Add the `Toaster` component to your root layout or app component:

```tsx
import { Toaster } from '@/components/ui/Toast';

function App() {
  return (
    <>
      {/* Your app content */}
      <Toaster position="top-right" />
    </>
  );
}
```

### 2. Show a toast notification

```tsx
import { Toast } from '@/components/ui/Toast';

// Simple toast
Toast.show('Action completed successfully');

// With options
Toast.show({
  title: 'Success',
  description: 'Your changes have been saved',
  variant: 'success',
  duration: 5000, // 5 seconds
});
```

## API Reference

### Toast Methods

#### `Toast.show(options: ToastOptions | string)`

Shows a toast notification. You can pass a string for a simple toast or an options object for more control.

```tsx
// Simple usage
Toast.show('Hello World');

// With options
Toast.show({
  title: 'Success',
  description: 'Operation completed',
  variant: 'success',
  duration: 3000,
  action: {
    label: 'Undo',
    onClick: () => console.log('Undo action')
  }
});
```

#### `Toast.success(title: string, description?: string, options?: ToastOptions)`
Shows a success toast.

#### `Toast.error(title: string, description?: string, options?: ToastOptions)`
Shows an error toast.

#### `Toast.warning(title: string, description?: string, options?: ToastOptions)`
Shows a warning toast.

#### `Toast.info(title: string, description?: string, options?: ToastOptions)`
Shows an info toast.

#### `Toast.dismiss(toastId?: string | number)`
Dismisses a specific toast by ID.

#### `Toast.dismissAll()`
Dismisses all visible toasts.

#### `Toast.promise(promise, messages, options)`
Shows a loading toast that updates based on the promise state.

```tsx
Toast.promise(
  fetchData(),
  {
    loading: 'Saving...',
    success: (data) => `Successfully saved ${data.items.length} items`,
    error: (err) => `Failed to save: ${err.message}`
  },
  {
    // Optional options
    duration: 5000,
    className: 'custom-toast'
  }
);
```

### Toaster Component

The `Toaster` component renders the toast container. It accepts the following props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `'top-left' \| 'top-center' \| 'top-right' \| 'bottom-left' \| 'bottom-center' \| 'bottom-right'` | `'bottom-right'` | Position of the toaster |
| `toastOptions` | `object` | `{}` | Default options for all toasts |
| `expand` | `boolean` | `false` | Expand all toasts by default |
| `richColors` | `boolean` | `false` | Use richer colors for the toasts |
| `closeButton` | `boolean` | `true` | Show close button on toasts |
| `visibleToasts` | `number` | `3` | Maximum number of toasts to show at once |
| `offset` | `string \| number` | `'16px'` | Offset from the edge of the screen |
| `dir` | `'ltr' \| 'rtl' \| 'auto'` | `'auto'` | Direction of the toasts |
| `theme` | `'light' \| 'dark' \| 'system'` | `'system'` | Theme for the toasts |
| `className` | `string` | - | Additional class name for the toaster |

### ToastOptions

Options for configuring individual toasts:

| Prop | Type | Description |
|------|------|-------------|
| `id` | `string \| number` | Unique identifier for the toast |
| `title` | `string` | Toast title |
| `description` | `string` | Optional description |
| `variant` | `'success' \| 'error' \| 'warning' \| 'info' \| 'default'` | Visual style of the toast |
| `duration` | `number` | Duration in milliseconds (default: 5000) |
| `action` | `{ label: string; onClick: () => void }` | Action button configuration |
| `className` | `string` | Additional CSS class for the toast |
| `style` | `React.CSSProperties` | Inline styles for the toast |

## Examples

### Basic Usage

```tsx
import { Toast } from '@/components/ui/Toast';

// Simple toast
Toast.show('Profile updated');

// With description
Toast.show({
  title: 'Success',
  description: 'Your profile has been updated',
  variant: 'success'
});

// With action
Toast.show({
  title: 'Message sent',
  description: 'Your message has been delivered',
  action: {
    label: 'Undo',
    onClick: () => console.log('Undo send')
  }
});
```

### Promise Example

```tsx
const handleSave = async (data) => {
  await Toast.promise(
    api.saveData(data),
    {
      loading: 'Saving...',
      success: 'Data saved successfully',
      error: (err) => `Failed to save: ${err.message}`
    },
    { duration: 3000 }
  );
};
```

### Custom Styling

```tsx
// Using className
Toast.show({
  title: 'Custom Styled',
  className: 'bg-purple-100 text-purple-800'
});

// Using style prop
Toast.show({
  title: 'Custom Styled',
  style: { 
    backgroundColor: 'var(--purple-100)',
    color: 'var(--purple-800)',
    border: '1px solid var(--purple-200)'
  }
});
```

## Best Practices

1. **Be Concise**: Keep toast messages short and to the point.
2. **Use Appropriate Variants**: Match the toast variant to the message type (success, error, etc.).
3. **Limit Duration**: Use shorter durations for less important notifications.
4. **Provide Actions**: For important actions, include a way to undo or take action.
5. **Don't Overuse**: Avoid showing too many toasts in quick succession.
6. **Accessibility**: Ensure text has sufficient contrast and is readable by screen readers.

## Migration from Previous Version

If you're migrating from the previous toast implementation, here are the key changes:

1. The component now uses Sonner under the hood
2. The API has been simplified but maintains backward compatibility
3. The `useToast` hook has been replaced with direct method calls
4. The `Toaster` component is now required to be placed in your app

## Related Components

- [Button](../components/ui/Button) - For action buttons in toasts
- [Modal](../components/ui/Modal) - For more complex user interactions
- [LoadingSpinner](../components/ui/LoadingSpinner) - For loading states in toasts

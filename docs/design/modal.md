---
title: Modal
category: Components
version: 1.2.0
updated: 2025-07-22
---

# Modal Component

A flexible and accessible modal dialog component built on top of shadcn/ui's Dialog component with additional features and customization options.

## Features

- Multiple size variants (sm, md, lg, xl, full, auto)
- Different display variants (default, centered, fullscreen, bottom-sheet)
- Configurable close behavior (overlay click, escape key)
- Accessible with proper ARIA attributes
- Responsive design
- Customizable header, body, and footer sections
- Built-in state management with `useModal` hook

## Installation

The Modal component is part of the UI components library and is automatically available when you import it from `@/components/ui/Modal`.

## Usage

### Basic Usage

```tsx
import { Modal, useModal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

function Example() {
  const { isOpen, open, close } = useModal();

  return (
    <>
      <Button onClick={open}>Open Modal</Button>
      <Modal isOpen={isOpen} onClose={close} title="Example Modal">
        <p>Modal content goes here</p>
      </Modal>
    </>
  );
}
```

### With Footer

```tsx
<Modal 
  isOpen={isOpen} 
  onClose={close} 
  title="Confirm Action"
  footer={
    <div className="flex justify-end space-x-2">
      <Button variant="outline" onClick={close}>
        Cancel
      </Button>
      <Button onClick={handleConfirm}>
        Confirm
      </Button>
    </div>
  }
>
  <p>Are you sure you want to perform this action?</p>
</Modal>
```

### Fullscreen Modal

```tsx
<Modal 
  isOpen={isOpen} 
  onClose={close} 
  title="Fullscreen Content"
  variant="fullscreen"
  showCloseButton
>
</Modal>
```

### Bottom Sheet (Mobile-friendly)

```tsx
<Modal 
  isOpen={isOpen} 
  onClose={close} 
  variant="bottom-sheet"
  title="Options"
>
</Modal>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | `false` | Controls the visibility of the modal |
| `onClose` | `() => void` | - | Callback when the modal is closed |
| `title` | `ReactNode` | - | The title of the modal |
| `children` | `ReactNode` | - | The content of the modal |
| `footer` | `ReactNode` | - | Custom footer content |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full' \| 'auto'` | `'md'` | Size of the modal |
| `variant` | `'default' \| 'centered' \| 'fullscreen' \| 'bottom-sheet'` | `'default'` | Variant of the modal |
| `showCloseButton` | `boolean` | `true` | Whether to show the close button |
| `closeOnOverlayClick` | `boolean` | `true` | Whether to close when clicking outside |
| `closeOnEsc` | `boolean` | `true` | Whether to close when pressing escape |
| `className` | `string` | - | Additional class names for the modal |
| `contentClassName` | `string` | - | Additional class names for the content |
| `overlayClassName` | `string` | - | Additional class names for the overlay |
| `headerClassName` | `string` | - | Additional class names for the header |
| `bodyClassName` | `string` | - | Additional class names for the body |
| `footerClassName` | `string` | - | Additional class names for the footer |
| `lockScroll` | `boolean` | `true` | Whether to lock body scroll when open |
| `initialFocusRef` | `RefObject<HTMLElement>` | - | Ref to focus when modal opens |
| `hideOverlay` | `boolean` | `false` | Whether to hide the overlay |
| `aria-label` | `string` | - | ARIA label for the modal |
| `aria-describedby` | `string` | - | ARIA describedby for the modal |

## useModal Hook

The `useModal` hook provides an easy way to manage modal state:

```tsx
const { 
  isOpen,  // boolean - current state
  open,    // () => void - open the modal
  close,   // () => void - close the modal
  toggle   // () => void - toggle the modal state
} = useModal(initialState = false);
```

## Best Practices

1. **Accessibility**: Always provide a meaningful `title` and use `aria-label` when the title isn't visible.
2. **Focus Management**: Use `initialFocusRef` to set focus to an appropriate element when the modal opens.
3. **Responsive Design**: Use the `bottom-sheet` variant for mobile devices to improve usability.
4. **Performance**: For complex modals, consider using `React.memo` to prevent unnecessary re-renders.
5. **Testing**: Test keyboard navigation and screen reader compatibility.

## Browser Support

The Modal component works in all modern browsers. For older browsers, ensure you have the appropriate polyfills for:
- CSS Grid
- CSS Custom Properties
- Intersection Observer API (for scroll locking)

## Troubleshooting

### Modal not showing up
- Ensure `isOpen` is set to `true`
- Check for any z-index conflicts in your CSS
- Verify there are no errors in the console

### Scroll locking issues
- If scroll locking isn't working, check if `lockScroll` is set to `true`
- Look for any global styles that might be overriding the scroll lock behavior

## Related Components

- [Dialog](../components/ui/dialog)
- [Drawer](../components/ui/drawer)
- [Alert Dialog](../components/ui/alert-dialog)

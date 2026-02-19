# Frontend Components Documentation

## Calculator Layout Components

We have introduced a set of shared components to standardize and improve the layout of calculator input forms. These components utilize a responsive grid system and provide a consistent look and feel across the application.

### `CalculatorForm`

This is the main container for calculator inputs. It handles the overall grid layout.

**Props:**
- `children`: React nodes (inputs, groups, etc.).
- `columns`: `1` | `2` (default: `1`). Controls the number of columns on medium screens and larger. On small screens, it always collapses to 1 column.
- `className`: Optional additional classes.

**Usage:**

```tsx
import { CalculatorForm } from './shared';

// Single column layout
<CalculatorForm>
  <CalculatorInput ... />
</CalculatorForm>

// Two column layout
<CalculatorForm columns={2}>
  <CalculatorInput ... />
  <CalculatorInput ... />
</CalculatorForm>
```

### `CalculatorInputGroup`

This component is used to group related inputs together visually. It acts as a wrapper and can optionally display a label for the group.

**Props:**
- `children`: React nodes.
- `label`: Optional string. The title of the group.
- `className`: Optional additional classes.

**Usage:**

```tsx
import { CalculatorInputGroup } from './shared';

<CalculatorInputGroup label="Loan Details">
  <CalculatorInput ... />
  <CalculatorInput ... />
</CalculatorInputGroup>
```

### `CalculatorInputRow`

This component forces inputs to be displayed side-by-side in a row, regardless of the parent grid settings. This is useful for placing two smaller inputs (like a value and a unit selector) next to each other.

**Props:**
- `children`: React nodes.
- `className`: Optional additional classes.

**Usage:**

```tsx
import { CalculatorInputRow } from './shared';

<CalculatorInputRow>
  <CalculatorInput ... /> // Will take up available space
  <CalculatorSelect ... /> // Will take up needed space
</CalculatorInputRow>
```

## Migration Guide

When updating existing calculators or creating new ones:

1.  **Import components** from `@/components/calculators/shared`.
2.  **Replace `<div>` wrappers** with `CalculatorForm`.
3.  **Group related inputs** using `CalculatorInputGroup`.
4.  **Use `CalculatorInputRow`** for tighter coupling of related fields (e.g., amount + currency).
5.  **Remove manual margin/padding classes** (`space-y-6`, `mb-4`, etc.) from inputs as the `CalculatorForm` handles gaps.

### Example Refactor

**Before:**

```tsx
<div className="space-y-6">
  <div className="mb-4">
    <CalculatorInput ... />
  </div>
  <div className="mb-4">
    <CalculatorInput ... />
  </div>
</div>
```

**After:**

```tsx
<CalculatorForm columns={1}>
  <CalculatorInput ... />
  <CalculatorInput ... />
</CalculatorForm>
```

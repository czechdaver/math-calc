---
title: Pagination
category: Components
version: 1.2.0
updated: 2025-07-23
---

# Pagination Component

A flexible pagination component built on top of shadcn/ui's Pagination, providing additional features like page size selection and info text.

## Features

- Multiple visual variants (default, outline, ghost)
- Responsive design
- Customizable page size options
- Page information display
- First/Last page navigation
- Previous/Next page navigation
- Ellipsis for large numbers of pages
- Keyboard navigation
- Accessible with proper ARIA attributes
- TypeScript support

## Installation

The Pagination component is part of the UI components library and is available at `@/components/ui/Pagination`.

## Basic Usage

### Simple Pagination

```tsx
import { Pagination } from '@/components/ui/Pagination';

function Example() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalItems = 100;
  const itemsPerPage = 10;

  return (
    <Pagination
      currentPage={currentPage}
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      onPageChange={setCurrentPage}
    />
  );
}
```

### With Page Size Selector

```tsx
function ExampleWithPageSize() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  const totalItems = 100;

  return (
    <Pagination
      currentPage={currentPage}
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      onPageChange={setCurrentPage}
      showPageSizeSelector
      onPageSizeChange={setItemsPerPage}
    />
  );
}
```

## Variants

### Default

```tsx
<Pagination
  currentPage={1}
  totalItems={50}
  itemsPerPage={10}
  onPageChange={() => {}}
  variant="default"
/>
```

### Outline

```tsx
<Pagination
  currentPage={1}
  totalItems={50}
  itemsPerPage={10}
  onPageChange={() => {}}
  variant="outline"
/>
```

### Ghost

```tsx
<Pagination
  currentPage={1}
  totalItems={50}
  itemsPerPage={10}
  onPageChange={() => {}}
  variant="ghost"
/>
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentPage` | `number` | - | Current page number (1-based) (required) |
| `totalItems` | `number` | - | Total number of items (required) |
| `itemsPerPage` | `number` | `10` | Number of items per page |
| `siblingCount` | `number` | `1` | Number of page buttons to show before and after the current page |
| `showFirstLastButtons` | `boolean` | `true` | Whether to show the first and last page buttons |
| `showPrevNextButtons` | `boolean` | `true` | Whether to show the previous and next buttons |
| `showPageInfo` | `boolean` | `true` | Whether to show the page info text |
| `showPageSizeSelector` | `boolean` | `false` | Whether to show the page size selector |
| `pageSizeOptions` | `number[]` | `[10, 20, 50, 100]` | Available page sizes |
| `onPageChange` | `(page: number) => void` | - | Callback when the page changes (required) |
| `onPageSizeChange` | `(pageSize: number) => void` | - | Callback when the page size changes |
| `variant` | `'default' \| 'outline' \| 'ghost'` | `'default'` | Visual style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the pagination |
| `className` | `string` | - | Additional class name for the pagination container |
| `itemClassName` | `string` | - | Additional class name for the pagination items |
| `activeItemClassName` | `string` | - | Additional class name for the active pagination item |
| `infoClassName` | `string` | - | Additional class name for the pagination info text |
| `pageSizeClassName` | `string` | - | Additional class name for the page size selector |
| `disabled` | `boolean` | `false` | Whether the pagination is disabled |
| `showEllipsis` | `boolean` | `true` | Whether to show ellipsis |

## Advanced Usage

### Controlled Pagination with Data Fetching

```tsx
import { useState, useEffect } from 'react';
import { Pagination } from '@/components/ui/Pagination';

function DataTable() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/data?page=${currentPage}&limit=${itemsPerPage}`
        );
        const result = await response.json();
        setData(result.data);
        setTotalItems(result.total);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage, itemsPerPage]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Render your data table here */}
      <table>
        {/* Table content */}
      </table>
      
      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        showPageSizeSelector
        onPageSizeChange={setItemsPerPage}
        disabled={isLoading}
      />
    </div>
  );
}
```

### Custom Styling

```tsx
<Pagination
  currentPage={currentPage}
  totalItems={100}
  itemsPerPage={10}
  onPageChange={setCurrentPage}
  className="my-4"
  itemClassName="mx-1"
  activeItemClassName="bg-blue-600 text-white"
  infoClassName="text-gray-700"
  pageSizeClassName="ml-auto"
/>
```

## Accessibility

The Pagination component includes the following accessibility features:

- Keyboard navigation (Tab, Enter/Space, Arrow keys)
- ARIA attributes for screen readers
- Proper focus management
- Disabled state for navigation items
- Screen reader announcements for page changes

## Best Practices

1. **Use with Large Datasets**: Pagination is most useful when dealing with large datasets that would be impractical to display all at once.

2. **Keep It Visible**: Ensure the pagination controls are easily discoverable, typically at the bottom of the content being paginated.

3. **Responsive Design**: The component is responsive, but test it at different screen sizes to ensure usability.

4. **Loading States**: Show loading states when changing pages to improve perceived performance.

5. **Accessibility**: The component is accessible by default, but ensure the surrounding context is also accessible.

## Related Components

- [Table](../components/ui/Table) - For displaying tabular data with pagination
- [DataTable](../components/ui/DataTable) - For advanced data tables with sorting, filtering, and pagination
- [Select](../components/ui/Select) - Used internally for the page size selector

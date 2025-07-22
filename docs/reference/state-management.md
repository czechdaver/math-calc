---
title: State Management
category: Reference
version: 1.2.0
updated: 2025-07-22
---

# State Management in MathCalc Pro

## Overview
This document outlines the state management strategy for the MathCalc Pro application, which combines React's built-in state management with React Query for server state and Jotai for global client state.

## State Management Architecture

### 1. Local Component State
**When to use:**
- Form inputs
- UI state (modals, dropdowns, etc.)
- Component-specific state that doesn't need to be shared

**Implementation:**
```typescript
const [value, setValue] = useState(initialValue);
```

### 2. URL State (Next.js Router)
**When to use:**
- Current route and route parameters
- Search/filter parameters
- Pagination state
- Calculator inputs that should be shareable via URL

**Implementation:**
```typescript
import { useRouter, useSearchParams } from 'next/navigation';

const router = useRouter();
const searchParams = useSearchParams();

// Update URL state
const updateUrl = (params: Record<string, string>) => {
  const newParams = new URLSearchParams(searchParams.toString());
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
  });
  router.push(`?${newParams.toString()}`, { scroll: false });
};
```

### 3. React Query (Server State)
**When to use:**
- Data fetching
- Caching API responses
- Background updates
- Request deduplication
- Pagination and infinite loading

**Implementation:**
```typescript
// hooks/useCalculators.ts
import { useQuery } from '@tanstack/react-query';

export const useCalculators = () => {
  return useQuery({
    queryKey: ['calculators'],
    queryFn: async () => {
      const response = await fetch('/api/calculators');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

### 4. Jotai (Global Client State)
**When to use:**
- Theme preference
- User preferences
- Global UI state (e.g., mobile menu open/closed)
- State that needs to be shared across multiple components

**Implementation:**
```typescript
// atoms/ui.ts
import { atom } from 'jotai';

export const themeAtom = atom<'light' | 'dark'>('light');
export const mobileMenuOpenAtom = atom(false);

// Example of derived atom
export const isDarkModeAtom = atom(
  (get) => get(themeAtom) === 'dark'
);
```

## State Persistence

### Local Storage
For persisting user preferences:
```typescript
// hooks/usePersistedState.ts
import { useEffect, useState } from 'react';

export function usePersistedState<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window === 'undefined') return initialValue;
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}
```

## State Management Best Practices

1. **Colocate State**: Keep state as close to where it's used as possible
2. **Avoid Prop Drilling**: Use context or state management for deeply nested state
3. **Immutability**: Always treat state as immutable
4. **Normalize State**: Keep state normalized to avoid duplication
5. **Derived State**: Use selectors to compute derived data
6. **Performance**: Use memoization for expensive calculations

## Performance Considerations

1. **Avoid Unnecessary Rerenders**: Use `React.memo`, `useMemo`, and `useCallback`
example
```typescript
const MemoizedComponent = React.memo(Component);

const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

2. **Code Splitting**: Use dynamic imports for large components
3. **Virtualization**: For large lists, use `react-window` or `react-virtualized`
4. **Debounce Inputs**: For search inputs or other frequent updates

## Debugging State

1. **React DevTools**: Inspect component state and props
2. **Redux DevTools**: For Jotai state inspection (with Jotai devtools)
3. **React Query DevTools**: For API state inspection
4. **Console Logging**: For quick debugging (remove in production)

## Testing State

1. **Unit Tests**: Test reducers and selectors in isolation
2. **Integration Tests**: Test component interactions with state
3. **E2E Tests**: Test complete user flows

## Error Handling

1. **Error Boundaries**: Catch JavaScript errors in components
2. **Error States**: Handle loading, error, and empty states
3. **Error Logging**: Log errors to your error tracking service

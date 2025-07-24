'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

/**
 * ThemeProvider component that wraps the application with theme context.
 * Supports light, dark, and system themes with smooth transitions.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch by only rendering the provider after mounting
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

/**
 * Custom hook to access the theme context
 * @returns The theme context with current theme and theme setter
 */
export function useTheme() {
  const context = React.useContext(NextThemesProvider);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/**
 * Returns the current theme (light/dark) based on the system preference
 * @returns 'light' | 'dark' based on system preference
 */
export function useSystemTheme() {
  const [systemTheme, setSystemTheme] = React.useState<'light' | 'dark'>('light');

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Set the initial theme
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    
    // Update theme when system preference changes
    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    
    // For older browsers
    mediaQuery.addListener(handler);
    
    return () => {
      mediaQuery.removeListener(handler);
    };
  }, []);

  return systemTheme;
}

/**
 * Returns the current theme with fallback to system preference
 * @returns The current theme ('light' | 'dark')
 */
export function useCurrentTheme() {
  const { theme, systemTheme } = useTheme();
  const systemPreference = useSystemTheme();
  
  if (theme === 'system') {
    return systemTheme || systemPreference;
  }
  
  return theme as 'light' | 'dark';
}

export default ThemeProvider;

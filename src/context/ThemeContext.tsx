import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

type Theme = 'light' | 'dark' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  resolvedTheme: 'light',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme-preference',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const router = useRouter();

  // Update the theme when it changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Clear all theme classes
    root.classList.remove('light', 'dark');
    
    // Determine the resolved theme (light or dark)
    let resolvedTheme: 'light' | 'dark';
    
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      resolvedTheme = prefersDark ? 'dark' : 'light';
    } else {
      resolvedTheme = theme === 'dark' ? 'dark' : 'light';
    }
    
    // Apply the resolved theme
    root.classList.add(resolvedTheme);
    root.style.colorScheme = resolvedTheme;
    setResolvedTheme(resolvedTheme);
    
    // Save theme preference
    localStorage.setItem(storageKey, theme);
    
    // Add data-theme attribute for third-party libraries
    root.setAttribute('data-theme', resolvedTheme);
    
    // Update meta theme color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        resolvedTheme === 'dark' ? '#1f2937' : '#ffffff'
      );
    }
    
    // Add transition for smooth theme switching
    const applyTransition = () => {
      const css = document.createElement('style');
      css.appendChild(
        document.createTextNode(
          `* {
            -webkit-transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
            -moz-transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
            transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
          }`
        )
      );
      document.head.appendChild(css);
      
      // Remove the style after the transition
      setTimeout(() => {
        document.head.removeChild(css);
      }, 300);
    };
    
    applyTransition();
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const newResolvedTheme = prefersDark ? 'dark' : 'light';
        root.classList.remove('light', 'dark');
        root.classList.add(newResolvedTheme);
        root.style.colorScheme = newResolvedTheme;
        setResolvedTheme(newResolvedTheme);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme, storageKey]);
  
  // Handle theme changes via URL query parameter
  useEffect(() => {
    const { theme: urlTheme } = router.query;
    
    if (urlTheme && typeof urlTheme === 'string' && ['light', 'dark', 'system'].includes(urlTheme)) {
      setTheme(urlTheme as Theme);
      // Remove the query parameter after setting the theme
      const { pathname, query } = router;
      delete query.theme;
      router.replace({ pathname, query }, undefined, { shallow: true });
    }
  }, [router.query]);

  const value = {
    theme,
    resolvedTheme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

// Theme toggle component
export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  
  // Ensure the component is mounted before rendering to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return (
      <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
    );
  }
  
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors"
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {resolvedTheme === 'dark' ? (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
}

// Theme script for preventing flash of incorrect theme
export function ThemeScript() {
  // This script runs before the page is rendered to prevent flash of incorrect theme
  const themeScript = `
    (function() {
      // Get the theme from localStorage or system preference
      const storageKey = 'theme-preference';
      const colorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      const persistedTheme = localStorage.getItem(storageKey);
      const theme = persistedTheme === 'dark' || persistedTheme === 'light' ? persistedTheme : colorScheme;
      
      // Apply the theme immediately
      document.documentElement.classList.add(theme);
      document.documentElement.style.colorScheme = theme;
      document.documentElement.setAttribute('data-theme', theme);
      
      // Set the theme color meta tag
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', theme === 'dark' ? '#1f2937' : '#ffffff');
      }
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}

export default ThemeProvider;

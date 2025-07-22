import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
 
/**
 * Combines multiple class names using clsx and tailwind-merge
 * This is a shadcn/ui compatible version of the cn utility
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Gets the CSS variable value from the document root
 * @param name CSS variable name (without -- prefix)
 * @returns The value of the CSS variable
 */
export function getCssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim();
}

/**
 * Sets a CSS variable on the document root
 * @param name CSS variable name (without -- prefix)
 * @param value Value to set
 */
export function setCssVar(name: string, value: string): void {
  document.documentElement.style.setProperty(`--${name}`, value);
}

/**
 * Removes a CSS variable from the document root
 * @param name CSS variable name (without -- prefix)
 */
export function removeCssVar(name: string): void {
  document.documentElement.style.removeProperty(`--${name}`);
}

/**
 * Gets the current theme (light/dark)
 * @returns 'dark' if dark mode is enabled, 'light' otherwise
 */
export function getCurrentTheme(): 'light' | 'dark' {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

/**
 * Toggles between light and dark theme
 * @param theme Theme to set ('light' or 'dark')
 */
export function setTheme(theme: 'light' | 'dark'): void {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

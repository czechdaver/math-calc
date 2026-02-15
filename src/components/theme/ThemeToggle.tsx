'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';

interface ThemeToggleProps {
  variant?: 'desktop' | 'mobile';
  showLabel?: boolean;
}

export function ThemeToggle({ variant = 'desktop', showLabel = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const t = useTranslations();
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={variant === 'desktop' ? 'w-9 h-9' : 'w-full h-10'}>
        {/* Skeleton placeholder */}
      </div>
    );
  }

  const cycleTheme = () => {
    if (theme === 'system') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('system');
  };

  const getIcon = () => {
    if (theme === 'light') return <Sun className="h-4 w-4" />;
    if (theme === 'dark') return <Moon className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };

  const getLabel = () => {
    if (theme === 'light') return t('theme_light');
    if (theme === 'dark') return t('theme_dark');
    return t('theme_system');
  };

  const getTooltip = () => {
    if (theme === 'system') return t('theme_toggle_tooltip_light');
    if (theme === 'light') return t('theme_toggle_tooltip_dark');
    return t('theme_toggle_tooltip_system');
  };

  const getAriaLabel = () => {
    if (theme === 'light') return t('theme_current_light');
    if (theme === 'dark') return t('theme_current_dark');
    return t('theme_current_system');
  };

  if (variant === 'mobile' && showLabel) {
    return (
      <button
        onClick={cycleTheme}
        className="flex items-center justify-between w-full px-3 py-2 text-base font-medium rounded-md text-muted-foreground hover:bg-accent hover:text-primary transition-colors duration-200"
        aria-label={getAriaLabel()}
        title={getTooltip()}
      >
        <span className="flex items-center gap-3">
          {getIcon()}
          <span>{getLabel()}</span>
        </span>
      </button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      aria-label={getAriaLabel()}
      title={getTooltip()}
      className="transition-colors duration-200"
    >
      {getIcon()}
    </Button>
  );
}

export default ThemeToggle;

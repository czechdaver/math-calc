// src/components/navigation/MainNavigation.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Menu, X, Calculator, ChevronDown, Heart, DollarSign, Settings, Hammer, Briefcase, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import LanguageSwitcher from './LanguageSwitcher';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/DropdownMenu';
import { cn } from '@/lib/utils';
import { getCalculatorCategories } from '@/lib/calculatorDataUtils';

const iconMap: Record<string, any> = {
  Heart,
  Calculator,
  DollarSign,
  Settings,
  Hammer,
  Briefcase,
  HelpCircle
};

const MainNavigation: React.FC = () => {
  const t = useTranslations('navigation'); // Assuming 'navigation' namespace exists, fallback to common if not
  const tCommon = useTranslations('common');

  // Fallback for translations if namespaces are not structured as expected
  const translate = (key: string) => {
    try {
      return t(key);
    } catch {
      return tCommon(key);
    }
  };

  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Extract locale from pathname
  const locale = pathname?.split('/')[1] || 'cs';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = getCalculatorCategories(locale, tCommon);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 py-3",
        isScrolled ? "glass-header py-2" : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 group relative">
            <style dangerouslySetInnerHTML={{
              __html: `
              .star-anim-1 { animation: star-anim-1 2s ease-in-out infinite; }
              .star-anim-2 { animation: star-anim-2 2.5s ease-in-out infinite 0.3s; }
              .star-anim-3 { animation: star-anim-3 2.2s ease-in-out infinite 0.6s; }
              
              @keyframes star-anim-1 {
                0%, 100% { transform: scale(0) rotate(0deg); opacity: 0; }
                50% { transform: translate(-14px, -14px) scale(1) rotate(45deg); opacity: 1; filter: drop-shadow(0 0 2px currentColor); }
              }
              @keyframes star-anim-2 {
                0%, 100% { transform: scale(0) rotate(0deg); opacity: 0; }
                50% { transform: translate(16px, -10px) scale(1.2) rotate(90deg); opacity: 1; filter: drop-shadow(0 0 2px currentColor); }
              }
              @keyframes star-anim-3 {
                0%, 100% { transform: scale(0) rotate(0deg); opacity: 0; }
                50% { transform: translate(12px, 12px) scale(0.8) rotate(-45deg); opacity: 1; filter: drop-shadow(0 0 2px currentColor); }
              }
            `}} />
            <div className="relative w-8 h-8 flex items-center justify-center bg-primary rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-200 z-10">
              <Calculator className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-foreground flex items-center relative z-10">
              Math<span className="text-primary">Calc</span>
              <div className="relative ml-[7px] mt-0.5 flex items-center justify-center">
                <span className="px-1 py-[1px] text-[12px] leading-none uppercase tracking-wider font-bold rounded bg-primary/10 text-primary/70 border border-primary/20 backdrop-blur-sm mix-blend-multiply dark:mix-blend-screen relative z-10 transition-all duration-300 group-hover:bg-primary/20 group-hover:text-primary group-hover:shadow-[0_0_10px_rgba(var(--primary),0.3)]">
                  PRO
                </span>
                {/* Magical Stars that appear on hover */}
                <svg className="absolute w-2.5 h-2.5 text-yellow-500/90 opacity-0 group-hover:opacity-100 star-anim-1 pointer-events-none z-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
                </svg>
                <svg className="absolute w-3 h-3 text-yellow-500/80 opacity-0 group-hover:opacity-100 star-anim-2 pointer-events-none z-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
                </svg>
                <svg className="absolute w-2 h-2 text-yellow-500 opacity-0 group-hover:opacity-100 star-anim-3 pointer-events-none z-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
                </svg>
              </div>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href={`/${locale}`}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {translate('home')}
            </Link>

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1 h-auto py-2 px-3 text-sm font-medium text-muted-foreground hover:text-primary">
                  {translate('categories')} <ChevronDown className="w-3 h-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56 p-2 glass">
                {categories.map((cat) => {
                  const IconComponent = iconMap[cat.icon] || HelpCircle;
                  return (
                    <DropdownMenuItem key={cat.id} asChild>
                      <Link
                        href={`/${locale}/calculator/${cat.id}`}
                        className="flex items-center gap-3 w-full cursor-pointer rounded-md p-2 hover:bg-muted/50"
                      >
                        <div className={`flex items-center justify-center w-8 h-8 rounded-md ${cat.bgColor}`}>
                          <IconComponent className={`w-5 h-5 ${cat.color}`} />
                        </div>
                        <span>{cat.title}</span>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href={`/${locale}/calculators`}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {translate('all_calculators')}
            </Link>

            <div className="h-4 w-[1px] bg-border mx-2" />

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="ml-1"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
              <span className="sr-only">{translate('toggle_menu')}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass-header border-t border-border/50 animate-accordion-down">
          <div className="container mx-auto py-4 px-4 flex flex-col gap-4">
            <Link
              href={`/${locale}`}
              className="text-sm font-medium py-2 border-b border-border/50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {translate('home')}
            </Link>

            <Link
              href={`/${locale}/calculators`}
              className="text-sm font-medium py-2 border-b border-border/50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {translate('all_calculators')}
            </Link>

            <div className="py-2 space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {translate('categories')}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/${locale}/calculator/${cat.id}`}
                    className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-muted/50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className={`w-2 h-2 rounded-full ${cat.bgColor}`} />
                    {cat.title}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-border/50 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{translate('settings')}</span>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default MainNavigation;

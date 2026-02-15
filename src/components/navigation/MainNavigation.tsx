'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Menu, X, Calculator, Home, Globe, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import categoriesData from '@/data/calculator-categories.json';
import calculatorsData from '@/data/calculators.json';

const MainNavigation: React.FC = () => {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const locale = pathname.split('/')[1] || 'en';
  const isOnCalculator = pathname.includes('/calculator/');

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // ✅ Fixed: Register listener once on mount, not on every scroll

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false); // ✅ Fixed: Close menu whenever pathname changes
  }, [pathname]);

  // Navigation items
  const navItems = [
    { name: t('nav.home'), href: '/', icon: <Home className="h-5 w-5" /> },
    {
      name: t('nav.calculators'),
      href: '/calculators',
      icon: <Calculator className="h-5 w-5" />,
    },
  ] as const;

  // Language options
  const languages = [
    { code: 'cs', name: 'Čeština' },
    { code: 'en', name: 'English' },
    { code: 'sk', name: 'Slovenčina' },
    { code: 'pl', name: 'Polski' },
    { code: 'hu', name: 'Magyar' },
  ] as const;

  const changeLanguage = (lang: string) => {
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.split('/').slice(2).join('/');
    const newPath = `/${lang}${pathWithoutLocale ? `/${pathWithoutLocale}` : ''}`;
    router.push(newPath);
  };

  // Get categories sorted by priority
  const categories = Object.values(categoriesData.categories).sort(
    (a, b) => a.priority - b.priority
  );

  // Get calculators for a category (top 5)
  const getCategoryCalculators = (categoryId: string) => {
    const category = categoriesData.categories[categoryId as keyof typeof categoriesData.categories];
    if (!category) return [];

    return category.calculators
      .slice(0, 5)
      .map(calcId => calculatorsData.calculators[calcId as keyof typeof calculatorsData.calculators])
      .filter(Boolean);
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 border-b border-border ${
        scrolled ? 'bg-background shadow-md' : 'bg-background'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <Calculator className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-foreground">
                {t('app_name')}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:ml-6 md:flex md:items-center md:space-x-8">
            <Link
              href={`/${locale}`}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === `/${locale}`
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-primary hover:bg-accent'
              } transition-colors duration-200`}
            >
              {t('nav.home')}
            </Link>

            {/* Calculators Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCategoryMenuOpen(true)}
              onMouseLeave={() => setCategoryMenuOpen(false)}
            >
              <button
                onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 ${
                  isOnCalculator
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-primary hover:bg-accent'
                } transition-colors duration-200`}
              >
                {t('nav.calculators')}
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${categoryMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {categoryMenuOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-card border border-border rounded-md shadow-lg z-50">
                  <div className="py-2">
                    {categories.map((category) => (
                      <div key={category.id} className="px-4 py-2">
                        <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                          {t(category.titleKey)}
                        </div>
                        <div className="space-y-1">
                          {getCategoryCalculators(category.id).map((calc) => (
                            <Link
                              key={calc.id}
                              href={`/${locale}${calc.path}`}
                              className="block px-2 py-1.5 text-sm text-foreground hover:bg-accent hover:text-primary rounded transition-colors duration-150"
                              onClick={() => setCategoryMenuOpen(false)}
                            >
                              {t(calc.titleKey)}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <ThemeToggle variant="desktop" />

            {/* Language Selector */}
            <div className="relative ml-4 flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <select
                id="desktop-language"
                aria-label={t('select_language')}
                value={locale}
                onChange={(e) => changeLanguage(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base bg-background text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-input sm:text-sm rounded-md"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.code.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ring"
              aria-expanded="false"
            >
              <span className="sr-only">{t('open_menu')}</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden grid transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="pt-2 pb-3 space-y-1 px-4">
          {/* Home Link */}
          <Link
            href={`/${locale}`}
            className={`group flex items-center px-3 py-2 text-base font-medium rounded-md ${
              pathname === `/${locale}`
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-primary'
            }`}
          >
            <Home className="h-5 w-5 mr-3" />
            {t('nav.home')}
          </Link>

          {/* Category Sections */}
          <div className="space-y-2 mt-2">
            <div className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase">
              {t('nav.calculators')}
            </div>
            {categories.map((category) => (
              <details key={category.id} className="group/category">
                <summary className="flex items-center justify-between px-3 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-md cursor-pointer list-none">
                  <span>{t(category.titleKey)}</span>
                  <ChevronDown className="h-4 w-4 transition-transform group-open/category:rotate-180" />
                </summary>
                <div className="pl-6 space-y-1 mt-1">
                  {getCategoryCalculators(category.id).map((calc) => (
                    <Link
                      key={calc.id}
                      href={`/${locale}${calc.path}`}
                      className="block px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-primary rounded-md transition-colors"
                    >
                      {t(calc.titleKey)}
                    </Link>
                  ))}
                </div>
              </details>
            ))}</div>

          {/* Theme Toggle */}
          <div className="pt-2 border-t border-border">
            <ThemeToggle variant="mobile" showLabel={true} />
          </div>

          {/* Language Selector */}
          <div className="px-3 py-2">
            <label
              htmlFor="mobile-language"
              className="block text-sm font-medium text-foreground mb-1"
            >
              {t('language')}
            </label>
            <select
              id="mobile-language"
              value={locale}
              onChange={(e) => changeLanguage(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base bg-background text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-input sm:text-sm rounded-md"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainNavigation;

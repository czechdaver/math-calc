'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Menu, X, Calculator, Home, ChevronDown, List, Check } from 'lucide-react';
import UnitsDropdown from '@/components/navigation/UnitsDropdown';
import { useUnits, UnitSet } from '@/contexts/UnitsContext';
import { createPortal } from 'react-dom';

const MainNavigation: React.FC = () => {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const locale = pathname.split('/')[1] || 'en';
  const { preference, setUnitSet, setAutoDetect } = useUnits();
  const langBtnRef = useRef<HTMLButtonElement>(null);
  const [langMenuPos, setLangMenuPos] = useState<{ top: number; right: number; width: number }>({ top: 0, right: 0, width: 0 });

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    // initialize on mount
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Position the language dropdown like Radix Portal so backdrop blur works over page, not header
  useEffect(() => {
    if (!isLanguageOpen) return;
    const update = () => {
      const el = langBtnRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setLangMenuPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
        width: rect.width,
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [isLanguageOpen]);

  // Close mobile menu and language dropdown when route changes or when clicking outside
  useEffect(() => {
    setIsMenuOpen(false);
    setIsLanguageOpen(false);
  }, [pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.language-dropdown')) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navigation items
  const navItems = [
    { name: t('nav.home'), href: '/', icon: <Home className="h-5 w-5" /> },
    {
      name: t('nav.calculators'),
      href: '/calculator',
      icon: <Calculator className="h-5 w-5" />,
    },
    {
      name: t('nav.all_calculators') || 'All Calculators',
      href: '/calculators',
      icon: <List className="h-5 w-5" />,
    },
  ] as const;

  // Language options with flags
  const languages = [
    { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
  ] as const;

  const changeLanguage = (lang: string) => {
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.split('/').slice(2).join('/');
    const newPath = `/${lang}${pathWithoutLocale ? `/${pathWithoutLocale}` : ''}`;
    router.push(newPath);
    setIsLanguageOpen(false);
  };

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  const unitLabel = useCallback((set: UnitSet) => {
    switch (set) {
      case 'metric':
        return t('units_metric');
      case 'imperial_uk':
        return t('units_imperial_uk');
      case 'imperial_us':
        return t('units_imperial_us');
      default:
        return t('units_metric');
    }
  }, [t]);

  const currentUnitsLabel = useMemo(() => {
    return preference.manualOverride ? unitLabel(preference.unitSet) : t('units_auto');
  }, [preference, t, unitLabel]);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'glass-nav-scrolled' 
          : 'glass-nav-light'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Enhanced Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href={`/${locale}`} className="flex items-center group transition-all duration-200 hover:scale-105">
              <div className="relative">
                <Calculator className="h-8 w-8 text-blue-600 transition-colors group-hover:text-blue-700" />
                <div className="absolute inset-0 bg-blue-100 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-200 scale-125"></div>
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {t('app_name')}
              </span>
            </Link>
          </div>

          {/* Enhanced Desktop Navigation */}
          <nav className="hidden md:ml-6 md:flex md:items-center md:space-x-2">
            {navItems.map((item) => {
              const isActive = pathname === `/${locale}${item.href}` || 
                             (item.href === '/' && pathname === `/${locale}`);
              return (
                <Link
                  key={item.name}
                  href={`/${locale}${item.href === '/' ? '' : item.href}`}
                  className={`
                    relative h-10 px-4 rounded-lg text-sm font-medium transition-all duration-200 
                    flex items-center gap-2 group
                    ${isActive 
                      ? 'text-blue-600 bg-blue-50 shadow-sm' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
                    }
                  `}
                >
                  <span className={`transition-transform duration-200 ${isActive ? '' : 'group-hover:scale-110'}`}>
                    {item.icon}
                  </span>
                  {item.name}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                  )}
                </Link>
              );
            })}

            {/* Enhanced Language Selector */}
            <div className="relative ml-6 language-dropdown">
              <button
                ref={langBtnRef}
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="
                  flex items-center gap-2 h-10 px-4 text-sm font-medium text-gray-700 
                  bg-white border border-gray-200 rounded-lg shadow-sm
                  hover:bg-gray-50 hover:border-gray-300 transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                "
              >
                <span className="text-base leading-none">{currentLanguage.flag}</span>
                <span className="hidden lg:inline">{currentLanguage.name}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isLanguageOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLanguageOpen && typeof window !== 'undefined' && createPortal(
                (
                  <div
                    className="language-dropdown fixed z-[60]"
                    style={{ top: langMenuPos.top, right: langMenuPos.right }}
                  >
                    <div
                      className="max-h-[50vh] glass-dropdown rounded-lg animate-in slide-in-from-top-2 origin-top-right overflow-y-auto"
                      style={{ width: langMenuPos.width }}
                    >
                      <div className="py-1">
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            className={`
                              w-full text-left px-4 py-2 text-sm flex items-center gap-3
                              transition-all duration-150 hover:bg-blue-50/80
                              ${lang.code === locale 
                                ? 'bg-blue-50/90 text-blue-700 shadow-sm' 
                                : 'text-gray-700 hover:text-blue-600'
                              }
                            `}
                          >
                            <span className="text-lg">{lang.flag}</span>
                            {lang.name}
                            {lang.code === locale && (
                              <Check className="ml-auto w-4 h-4 text-blue-700" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ),
                document.body
              )}
            </div>
            {/* Units selector (desktop) */}
            <UnitsDropdown />
          </nav>

          {/* Enhanced Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="
                inline-flex items-center justify-center p-2 rounded-lg
                text-gray-700 bg-white border border-gray-200 shadow-sm
                hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                transition-all duration-200
              "
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? t('close_menu') : t('open_menu')}
            >
              <div className="relative w-6 h-6">
                <Menu className={`absolute inset-0 w-6 h-6 transition-all duration-200 ${isMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} />
                <X className={`absolute inset-0 w-6 h-6 transition-all duration-200 ${isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile menu */}
      <div
        className={`md:hidden glass-medium border-t border-white/20 transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100 shadow-2xl' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="pt-4 pb-6 space-y-2 px-4">
          {navItems.map((item) => {
            const isActive = pathname === `/${locale}${item.href}` || 
                           (item.href === '/' && pathname === `/${locale}`);
            return (
              <Link
                key={item.name}
                href={`/${locale}${item.href === '/' ? '' : item.href}`}
                className={`
                  group flex items-center px-4 py-3 text-base font-medium rounded-lg
                  transition-all duration-200 relative
                  ${isActive
                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                    : 'text-gray-700 hover:bg-blue-50/50 hover:text-blue-600'
                  }
                `}
              >
                <span className={`mr-3 transition-transform duration-200 ${isActive ? '' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </span>
                {item.name}
                {isActive && (
                  <div className="absolute right-3 w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </Link>
            );
          })}

          {/* Enhanced Mobile Language Selector */}
          <div className="pt-4 mt-4 border-t border-gray-100">
            <div className="px-1 mb-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                {t('language')}
              </div>
              <div className="space-y-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`
                      w-full text-left px-4 py-3 text-base font-medium rounded-lg
                      flex items-center gap-3 transition-all duration-200
                      ${lang.code === locale 
                        ? 'bg-blue-50 text-blue-600 shadow-sm' 
                        : 'text-gray-700 hover:bg-blue-50/50 hover:text-blue-600'
                      }
                    `}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    {lang.name}
                    {lang.code === locale && (
                      <Check className="ml-auto w-4 h-4 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Units Selector */}
          <div className="pt-2 mt-2 border-t border-gray-100">
            <div className="px-1 mb-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                {t('units')} <span className="text-gray-400">·</span> <span className="text-gray-500">{currentUnitsLabel}</span>
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => setAutoDetect()}
                  className={`
                    w-full text-left px-4 py-3 text-base font-medium rounded-lg
                    flex items-center gap-3 transition-all duration-200
                    ${!preference.manualOverride 
                      ? 'bg-blue-50 text-blue-600 shadow-sm'
                      : 'text-gray-700 hover:bg-blue-50/50 hover:text-blue-600'
                    }
                  `}
                >
                  {t('units_auto')}
                  {!preference.manualOverride && (
                    <Check className="ml-auto w-4 h-4 text-blue-600" />
                  )}
                </button>

                {(['metric', 'imperial_uk', 'imperial_us'] as UnitSet[]).map((set) => {
                  const selected = preference.manualOverride && preference.unitSet === set;
                  return (
                    <button
                      key={set}
                      onClick={() => setUnitSet(set)}
                      className={`
                        w-full text-left px-4 py-3 text-base font-medium rounded-lg
                        flex items-center gap-3 transition-all duration-200
                        ${selected 
                          ? 'bg-blue-50 text-blue-600 shadow-sm'
                          : 'text-gray-700 hover:bg-blue-50/50 hover:text-blue-600'
                        }
                      `}
                    >
                      {unitLabel(set)}
                      {selected && (
                        <Check className="ml-auto w-4 h-4 text-blue-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainNavigation;

'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Menu, X, Calculator, Home } from 'lucide-react';

const MainNavigation: React.FC = () => {
  const t = useTranslations('common');
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const locale = pathname.split('/')[1] || 'en';

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
  }, [scrolled]);

  // Close mobile menu when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMenuOpen(false);
    };

    window.addEventListener('routeChangeStart', handleRouteChange);
    return () => {
      window.removeEventListener('routeChangeStart', handleRouteChange);
    };
  }, []);

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
  ] as const;

  const changeLanguage = (lang: string) => {
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.split('/').slice(2).join('/');
    const newPath = `/${lang}${pathWithoutLocale ? `/${pathWithoutLocale}` : ''}`;
    router.push(newPath);
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <Calculator className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                {t('app_name')}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:ml-6 md:flex md:items-center md:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={`/${locale}${item.href === '/' ? '' : item.href}`}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === `/${locale}${item.href}` || 
                  (item.href === '/' && pathname === `/${locale}`)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                } transition-colors duration-200`}
              >
                {item.name}
              </Link>
            ))}

            {/* Language Selector */}
            <div className="relative ml-4">
              <select
                value={locale}
                onChange={(e) => changeLanguage(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
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
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="pt-2 pb-3 space-y-1 px-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={`/${locale}${item.href === '/' ? '' : item.href}`}
              className={`group flex items-center px-3 py-2 text-base font-medium rounded-md ${
                pathname === `/${locale}${item.href}` || 
                (item.href === '/' && pathname === `/${locale}`)
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}

          {/* Language Selector */}
          <div className="px-3 py-2">
            <label
              htmlFor="mobile-language"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t('language')}
            </label>
            <select
              id="mobile-language"
              value={locale}
              onChange={(e) => changeLanguage(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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
    </header>
  );
};

export default MainNavigation;

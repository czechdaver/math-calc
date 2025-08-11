// src/components/navigation/Footer.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { getCalculatorCategories, getQuickLinks } from '@/lib/calculatorDataUtils';

const Footer: React.FC = () => {
  const t = useTranslations();
  const params = useParams();
  const locale = (params?.locale as string) || 'cs';

  const categories = getCalculatorCategories(locale, t).slice(0, 6);
  const popular = getQuickLinks('popular', locale, t).slice(0, 6);

  const openCookieSettings = () => {
    if (typeof window === 'undefined') return;
    try {
      // IAB TCF v2 common API
      if ((window as any).__tcfapi) {
        (window as any).__tcfapi('displayConsentUi', 2, () => {});
        return;
      }
      // Some CMPs
      if ((window as any).__cmp) {
        (window as any).__cmp('showConsentManager');
        return;
      }
    } catch (_) {}
    // Fallback custom event for app to listen to
    window.dispatchEvent(new CustomEvent('open-cookie-settings'));
  };

  const year = new Date().getFullYear();
  const siteName = 'David Motalik';

  return (
    <footer role="contentinfo" aria-label="Site footer" className="w-full bg-transparent">
      <div className="w-full px-4 pt-8 md:pt-10 pb-[calc(6rem+env(safe-area-inset-bottom))] lg:pb-10">
        <nav aria-label="Footer links" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Categories */}
          <div>
            <h3 className="text-xs font-semibold text-gray-800 mb-3">{t('footer.categories')}</h3>
            <ul className="space-y-1.5">
              {categories.map(cat => (
                <li key={cat.id}>
                  <Link
                    href={`/${locale}#${cat.id}`}
                    className="text-xs text-gray-600 hover:text-gray-800 hover:underline"
                  >
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular calculators */}
          <div>
            <h3 className="text-xs font-semibold text-gray-800 mb-3">{t('footer.popular_calculators')}</h3>
            <ul className="space-y-1.5">
              {popular.map(item => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="text-xs text-gray-600 hover:text-gray-800 hover:underline"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <h3 className="text-xs font-semibold text-gray-800 mb-3">{t('footer.privacy')}</h3>
            <ul className="space-y-1.5">
              <li>
                <Link href={`/${locale}/privacy-policy`} className="text-xs text-gray-600 hover:text-gray-800 hover:underline">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/cookies`} className="text-xs text-gray-600 hover:text-gray-800 hover:underline">
                  {t('footer.cookies_tracking')}
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openCookieSettings}
                  className="text-xs text-gray-600 hover:text-gray-800 hover:underline"
                >
                  {t('footer.manage_cookies')}
                </button>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="text-xs text-gray-600 hover:text-gray-800 hover:underline">
                  {t('footer.contact')}
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <p className="mt-6 text-left text-[11px] leading-5 text-gray-500">
          {t('footer.ads_note')}
        </p>

        <div className="mt-8 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] text-gray-500">
          <div>© {year} {siteName}</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

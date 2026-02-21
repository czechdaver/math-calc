'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

const COOKIE_CONSENT_KEY = 'cookie_consent';
const CONSENT_GRANTED_EVENT = new Event('consentGranted');
const CONSENT_DENIED_EVENT = new Event('consentDenied');

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations('common.cookies');
  const locale = useLocale();

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setIsVisible(true);
    } else if (consent === 'granted') {
      window.dispatchEvent(CONSENT_GRANTED_EVENT);
    } else if (consent === 'denied') {
      window.dispatchEvent(CONSENT_DENIED_EVENT);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'granted');
    setIsVisible(false);
    window.dispatchEvent(CONSENT_GRANTED_EVENT);
  };

  const handleDeny = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'denied');
    setIsVisible(false);
    window.dispatchEvent(CONSENT_DENIED_EVENT);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4">
      <div className="mx-auto max-w-5xl rounded-2xl border border-white/15 dark:border-white/10 bg-slate-900/90 dark:bg-slate-950/95 backdrop-blur-xl shadow-2xl shadow-black/20">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 sm:p-5">
          {/* Cookie icon + text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0 mt-0.5" aria-hidden="true">🍪</span>
              <p className="text-sm text-slate-200 leading-relaxed">
                {t.rich('text', {
                  privacyLink: (chunks) => (
                    <Link
                      href={`/${locale}/privacy`}
                      className="font-medium text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
                    >
                      {chunks}
                    </Link>
                  ),
                  cookieLink: (chunks) => (
                    <Link
                      href={`/${locale}/cookies`}
                      className="font-medium text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
                    >
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 sm:flex-shrink-0 pl-8 sm:pl-0">
            <button
              onClick={handleDeny}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white border border-slate-600 hover:border-slate-400 rounded-lg transition-all duration-200 hover:bg-white/5"
            >
              {t('decline')}
            </button>
            <button
              onClick={handleAccept}
              className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-lg transition-all duration-200 shadow-md shadow-blue-900/30 hover:shadow-lg hover:shadow-blue-900/40"
            >
              {t('accept_all')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;

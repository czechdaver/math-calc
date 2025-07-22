import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { cn } from '@/lib/utils';

const Footer: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: t('footer.about.title'),
      links: [
        { label: t('footer.about.company'), href: '/o-nas' },
        { label: t('footer.about.team'), href: '/tym' },
        { label: t('footer.about.careers'), href: '/kariera' },
        { label: t('footer.about.blog'), href: '/blog' },
      ],
    },
    {
      title: t('footer.support.title'),
      links: [
        { label: t('footer.support.help_center'), href: '/napoveda' },
        { label: t('footer.support.contact'), href: '/kontakt' },
        { label: t('footer.support.faq'), href: '/caste-dotazy' },
      ],
    },
    {
      title: t('footer.legal.title'),
      links: [
        { label: t('footer.legal.terms'), href: '/podminky-pouziti' },
        { label: t('footer.legal.privacy'), href: '/ochrana-osobnich-udaju' },
        { label: t('footer.legal.cookies'), href: '/pouziti-cookies' },
      ],
    },
    {
      title: t('footer.resources.title'),
      links: [
        { label: t('footer.resources.documentation'), href: '/dokumentace' },
        { label: t('footer.resources.api'), href: '/api' },
        { label: t('footer.resources.status'), href: '/status' },
      ],
    },
  ];

  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/yourusername/math-calc',
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/yourusername',
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/yourpage',
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <nav className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {footerLinks.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link
                      href={link.href}
                      className={cn(
                        'text-base text-gray-400 hover:text-white',
                        'transition-colors duration-200',
                        'flex items-center space-x-2'
                      )}
                    >
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="mt-12 border-t border-gray-800 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            {socialLinks.map((item, itemIdx) => (
              <a
                key={itemIdx}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label={item.name}
              >
                <span className="sr-only">{item.name}</span>
                {item.icon}
              </a>
            ))}
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-base text-gray-400">
              &copy; {currentYear} {t('app_name')}. {t('footer.rights')}.
            </p>
            <div className="mt-2 flex flex-wrap space-x-4 text-sm text-gray-400">
              <Link
                href="/podminky-pouziti"
                className="hover:text-white transition-colors duration-200"
              >
                {t('footer.terms')}
              </Link>
              <Link
                href="/ochrana-osobnich-udaju"
                className="hover:text-white transition-colors duration-200"
              >
                {t('footer.privacy')}
              </Link>
              <Link
                href="/pouziti-cookies"
                className="hover:text-white transition-colors duration-200"
              >
                {t('footer.cookies')}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8">
          <div className="md:flex md:items-center md:justify-between">
            <p className="text-sm text-gray-400">
              {t('footer.made_with')}{' '}
              <span role="img" aria-label="love">
                ❤️
              </span>{' '}
              {t('footer.in')} {new Date().getFullYear()}
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-gray-400">
                {t('footer.version')} {process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

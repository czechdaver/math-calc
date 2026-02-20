import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

const Footer: React.FC = () => {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: t('footer.navigation'),
      links: [
        { label: t('common.all_calculators'), href: '/calculators' },
        { label: t('footer.about.company'), href: '/about' },
        { label: t('footer.support.contact'), href: '/contact' },
      ],
    },
    {
      title: t('footer.legal.title'),
      links: [
        { label: t('footer.legal.terms'), href: '/terms' },
        { label: t('footer.legal.privacy'), href: '/privacy' },
        { label: t('footer.legal.cookies'), href: '/cookies' },
      ],
    },
  ];

  return (
    <footer className="relative mt-24 border-t border-white/10 glass bg-background/60">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80 pointer-events-none" />

      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-2 lg:gap-12 max-w-2xl mx-auto md:mx-0">
          {footerLinks.map((section, sectionIdx) => (
            <div key={sectionIdx} className="flex flex-col space-y-4">
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link
                      href={link.href}
                      className={cn(
                        'text-sm text-muted-foreground hover:text-primary',
                        'transition-colors duration-200 ease-in-out',
                        'inline-flex items-center group'
                      )}
                    >
                      <span className="relative">
                        {link.label}
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full"></span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground w-full justify-center md:justify-start">
            <p>
              &copy; {currentYear} <span className="font-semibold text-foreground">{t('app_name')}</span>. {t('footer.rights')}.
            </p>
            <div className="hidden md:block w-1 h-1 rounded-full bg-border" />
            <p>
              {t('footer.made_with')}{' '}
              <span role="img" aria-label="love" className="mx-1 text-red-500 animate-pulse inline-block">
                ❤️
              </span>{' '}
              {t('footer.in')} {currentYear}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

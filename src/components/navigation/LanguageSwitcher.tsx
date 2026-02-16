'use client';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { Globe, Check } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
    const t = useTranslations('common');
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    // Handle language change
    const handleLanguageChange = (newLocale: string) => {
        // Replace the locale in the pathname
        const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
        router.replace(newPathname);
    };

    const languages = [
        { code: 'cs', label: 'Čeština' },
        { code: 'en', label: 'English' },
        { code: 'sk', label: 'Slovenčina' },
        { code: 'de', label: 'Deutsch' },
        // Add more languages as needed
    ];

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Globe className="h-4 w-4" />
                    <span className="sr-only">{t('switch_language') || 'Switch language'}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className="cursor-pointer"
                    >
                        <span className={locale === lang.code ? "font-bold" : ""}>
                            {lang.label}
                        </span>
                        {locale === lang.code && <Check className="ml-auto h-4 w-4" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default LanguageSwitcher;

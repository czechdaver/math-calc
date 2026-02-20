import { useTranslations } from 'next-intl';
import React from 'react';

export default function CookiesPage() {
    const t = useTranslations('legal');

    return (
        <div className="container mx-auto p-4 max-w-4xl py-12">
            <h1 className="text-3xl font-bold mb-6">{t('cookies_title')}</h1>
            <div className="prose dark:prose-invert max-w-none">
                {t('cookies_content').split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 whitespace-pre-wrap">{paragraph}</p>
                ))}
            </div>
        </div>
    );
}

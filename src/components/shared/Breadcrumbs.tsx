import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { useTranslations } from 'next-intl';

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    homeHref?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, homeHref = '/' }) => {
    const t = useTranslations('common');

    return (
        <nav className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-1">
            <Link href={homeHref} className="hover:text-primary transition-colors flex items-center gap-1">
                <Home className="w-3.5 h-3.5" />
                {t('home')}
            </Link>

            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 flex-shrink-0" />
                    {item.href ? (
                        <Link href={item.href} className="hover:text-primary transition-colors">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-foreground font-semibold">{item.label}</span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};

export default Breadcrumbs;

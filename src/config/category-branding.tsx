import {
    TrendingUp,
    Heart,
    Calculator,
    Ruler,
    Percent,
    Briefcase,
    Settings,
    Hammer,
    DollarSign,
    HelpCircle,
    LucideIcon
} from 'lucide-react';

export type CategoryId = 'finance' | 'health' | 'math' | 'construction' | 'utility' | 'practical' | 'others';

export interface CategoryBranding {
    id: string; // broadened to string to allow flexible lookups but we prefer CategoryId
    icon: LucideIcon;
    color: string; // Text color class
    bgColor: string; // Background color class
    gradient?: string; // Optional gradient for cards
}

// Default fallback branding
export const DEFAULT_BRANDING: CategoryBranding = {
    id: 'default',
    icon: Percent,
    color: "text-slate-600 dark:text-slate-400",
    bgColor: "bg-slate-500/10",
};

export const CATEGORY_BRANDING: Record<string, CategoryBranding> = {
    finance: {
        id: 'finance',
        icon: TrendingUp, // Using TrendingUp as it looks more modern than DollarSign
        color: "text-emerald-600 dark:text-emerald-400",
        bgColor: "bg-emerald-500/10",
    },
    health: {
        id: 'health',
        icon: Heart,
        color: "text-rose-600 dark:text-rose-400",
        bgColor: "bg-rose-500/10",
    },
    math: {
        id: 'math',
        icon: Calculator,
        color: "text-indigo-600 dark:text-indigo-400",
        bgColor: "bg-indigo-500/10",
    },
    construction: {
        id: 'construction',
        icon: Hammer, // Hammer is very representative for construction
        color: "text-amber-600 dark:text-amber-400",
        bgColor: "bg-amber-500/10",
    },
    utility: {
        id: 'utility',
        icon: Settings,
        color: "text-gray-600 dark:text-gray-400",
        bgColor: "bg-gray-500/10",
    },
    practical: {
        id: 'practical',
        icon: Briefcase,
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-500/10",
    },
    others: {
        id: 'others',
        icon: HelpCircle,
        color: "text-slate-600 dark:text-slate-400",
        bgColor: "bg-slate-500/10",
    }
};

/**
 * simplified lookup function with fallback
 */
export const getCategoryBranding = (id: string): CategoryBranding => {
    return CATEGORY_BRANDING[id] || DEFAULT_BRANDING;
};

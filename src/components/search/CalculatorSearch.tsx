"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Calculator } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { searchCalculators } from '@/lib/calculatorDataUtils';


interface SearchResult {
    id: string;
    title: string;
    description: string;
    href: string;
    category: string;
    popularity: number;
}

interface CalculatorSearchProps {
    className?: string;
    placeholder?: string;
    onSearch?: (query: string) => void;
    hideDropdown?: boolean;
}

const CalculatorSearch: React.FC<CalculatorSearchProps> = ({
    className,
    placeholder,
    onSearch,
    hideDropdown = false
}) => {
    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);

    // Handle outside click to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Instant search (client-side)
    useEffect(() => {
        if (onSearch) {
            onSearch(query);
        }

        if (query.trim().length === 0) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        const runSearch = () => {
            try {
                // Perform client-side search
                const searchResults = searchCalculators(query, locale, t);
                setResults(searchResults);
                setIsOpen(true);
            } catch (error) {
                console.error('Search error:', error);
                setResults([]);
            }
        };

        runSearch();
    }, [query, locale, t, onSearch]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0 && results[selectedIndex]) {
                handleSelect(results[selectedIndex]);
            } else if (results.length > 0) {
                // First result if none selected
                handleSelect(results[0]);
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    const handleSelect = (result: SearchResult) => {
        router.push(result.href);
        setIsOpen(false);
        setQuery('');
    };

    return (
        <div ref={containerRef} className={cn("relative group max-w-xl mx-auto", className)}>
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative">
                <input
                    type="text"
                    placeholder={placeholder || t('homepage.search_placeholder')}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => query.length > 0 && setIsOpen(true)}
                    className="w-full px-6 py-4 pl-14 text-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-xl text-foreground placeholder-muted-foreground transition-all"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
                    {isLoading ? (
                        <Loader2 className="h-6 w-6 text-primary animate-spin" />
                    ) : (
                        <Search className="h-6 w-6 text-muted-foreground" />
                    )}
                </div>
            </div>

            {/* Results Dropdown */}
            {!hideDropdown && isOpen && (results.length > 0 || isLoading) && (
                <div className="absolute top-full left-0 right-0 mt-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                    <div className="py-2">
                        {results.length > 0 ? (
                            results.map((result, index) => (
                                <button
                                    key={result.id}
                                    onClick={() => handleSelect(result)}
                                    className={cn(
                                        "w-full text-left px-6 py-3 flex items-start gap-4 hover:bg-primary/10 transition-colors",
                                        index === selectedIndex && "bg-primary/10"
                                    )}
                                >
                                    <div className="mt-1 p-2 bg-primary/10 rounded-lg text-primary">
                                        <Calculator className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">{result.title}</h4>
                                        <p className="text-sm text-muted-foreground line-clamp-1">{result.description}</p>
                                    </div>
                                </button>
                            ))
                        ) : (
                            !isLoading && (
                                <div className="px-6 py-8 text-center text-muted-foreground">
                                    {t('common.no_results_found')}
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalculatorSearch;

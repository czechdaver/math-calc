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
    const [isLoading] = useState(false);
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
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 glow-anim"></div>
            <style dangerouslySetInnerHTML={{
                __html: `
              .star-anim-1 { animation: star-anim-1 2s ease-in-out infinite; }
              .star-anim-2 { animation: star-anim-2 2.5s ease-in-out infinite 0.3s; }
              .star-anim-3 { animation: star-anim-3 2.2s ease-in-out infinite 0.6s; }
              
              .glow-anim { animation: float-glow 4s ease-in-out infinite; }
              .group:hover .glow-anim { animation: float-glow-hover 3s ease-in-out infinite; }
              
              @keyframes float-glow {
                0%, 100% { transform: scale(1) translateY(0); filter: blur(8px); }
                50% { transform: scale(1.02) translateY(2px); filter: blur(12px); opacity: 0.35; }
              }
              @keyframes float-glow-hover {
                0%, 100% { transform: scale(1.02) translateY(0); filter: blur(12px); }
                50% { transform: scale(1.04) translateY(2px); filter: blur(16px); opacity: 0.55; }
              }
              
              @keyframes star-anim-1 {
                0%, 100% { transform: scale(0) rotate(0deg); opacity: 0; }
                50% { transform: translate(-20px, -20px) scale(1) rotate(45deg); opacity: 1; filter: drop-shadow(0 0 2px currentColor); }
              }
              @keyframes star-anim-2 {
                0%, 100% { transform: scale(0) rotate(0deg); opacity: 0; }
                50% { transform: translate(24px, -14px) scale(1.2) rotate(90deg); opacity: 1; filter: drop-shadow(0 0 2px currentColor); }
              }
              @keyframes star-anim-3 {
                0%, 100% { transform: scale(0) rotate(0deg); opacity: 0; }
                50% { transform: translate(8px, 16px) scale(0.8) rotate(-45deg); opacity: 1; filter: drop-shadow(0 0 2px currentColor); }
              }
            `}} />
            <div className="relative">
                <input
                    type="text"
                    placeholder={placeholder || t('homepage.search_placeholder')}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => query.length > 0 && setIsOpen(true)}
                    className="w-full px-6 py-4 pl-14 pr-[12.5%] text-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-xl text-foreground placeholder-muted-foreground transition-all"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none z-10">
                    {isLoading ? (
                        <Loader2 className="h-6 w-6 text-primary animate-spin" />
                    ) : (
                        <Search className="h-6 w-6 text-muted-foreground" />
                    )}
                </div>
                {/* Magical Stars right side 1/8 width */}
                <div className="absolute inset-y-0 right-0 w-[12.5%] flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="absolute w-4 h-4 text-yellow-500/90 star-anim-1 pointer-events-none z-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
                    </svg>
                    <svg className="absolute w-5 h-5 text-yellow-500/80 star-anim-2 pointer-events-none z-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
                    </svg>
                    <svg className="absolute w-3 h-3 text-yellow-500 star-anim-3 pointer-events-none z-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
                    </svg>
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

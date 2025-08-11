"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { useTranslations } from "next-intl";

export type BreadcrumbItem = {
  label: string;
  href?: string;
  current?: boolean;
};

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
  enhanced?: boolean;
}

/**
 * Global, localized breadcrumb component.
 * - Accepts explicit items (recommended), otherwise falls back to Home only.
 * - Styled to match enhanced UI with subtle rounded container and separators.
 */
const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = "", enhanced = false }) => {
  const params = useParams();
  const locale = (params?.locale as string) || "cs";
  const t = useTranslations();

  const defaultItems: BreadcrumbItem[] = [
    { label: t("common.home"), href: `/${locale}`, current: true },
  ];

  const list = (items?.length ? items : defaultItems).filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className={`flex items-center gap-1 text-xs sm:text-sm ${enhanced ? "bg-white/40 backdrop-blur-sm rounded-md px-2.5 py-1.5 border border-white/30 shadow-sm" : ""}`}>
        {list.map((item, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === list.length - 1 || item.current;
          return (
            <li key={`${item.label}-${idx}`} className="flex items-center gap-1 min-w-0">
              {idx > 0 && (
                <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" aria-hidden="true" />
              )}
              {isFirst ? (
                <Home className="w-4 h-4 text-gray-400 shrink-0" aria-hidden="true" />
              ) : null}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-gray-600 hover:text-blue-600 transition-colors truncate max-w-[14ch] sm:max-w-none"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`truncate max-w-[18ch] sm:max-w-none ${isLast ? (enhanced ? "text-gray-900 font-medium" : "text-gray-700") : "text-gray-600"}`}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

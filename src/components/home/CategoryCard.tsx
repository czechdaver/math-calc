"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { PanelColor } from "@/components/ui/PanelHeader";

export interface CategoryCardProps {
  title: React.ReactNode;
  countLabel: React.ReactNode; // already localized string like "4 kalkulátory k dispozici"
  href?: string; // optional; if omitted, rendered as a static panel
  ctaLabel?: React.ReactNode;
  icon: React.ElementType | React.ReactNode;
  color?: PanelColor; // controls icon tint
  variant?: PanelColor; // controls gradient background
  className?: string;
}

// Use the same gradient utility classes as PanelHeader for identical saturation/intensity
const gradientByVariant: Record<PanelColor, string> = {
  blue: "enhanced-card-header",
  green: "enhanced-card-header-green",
  purple: "enhanced-card-header-purple",
  indigo: "enhanced-card-header-indigo",
  amber: "enhanced-card-header-amber",
  gray: "enhanced-card-header-gray",
};

// Match PanelHeader title/icon tint for consistent brand color
const iconColorByColor: Record<PanelColor, string> = {
  blue: "text-blue-600",
  green: "text-green-600",
  purple: "text-purple-600",
  indigo: "text-indigo-600",
  amber: "text-amber-600",
  gray: "text-gray-700",
};

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  countLabel,
  href,
  ctaLabel = "Explore category",
  icon,
  color = "blue",
  variant = "blue",
  className = "",
}) => {
  const Icon = icon as React.ElementType;
  const iconIsElement = React.isValidElement(icon);

  const commonProps: { className: string; "aria-label"?: string } = {
    className: cn(
      "group relative rounded-2xl overflow-hidden border border-white/20 panel-shadow",
      "transition-all duration-200 hover:-translate-y-0.5",
      gradientByVariant[variant],
      className
    ),
    "aria-label": typeof title === "string" ? (title as string) : undefined,
  };

  return href ? (
    <Link href={href} {...commonProps}>
      {/* subtle glass border overlay */}
      <div className="absolute inset-0 bg-white/5 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center p-8 sm:p-10 min-h-[220px]">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white flex items-center justify-center mb-5 sm:mb-6 shadow-sm">
          {iconIsElement ? (
            React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
              className: cn("w-9 h-9 sm:w-11 sm:h-11", iconColorByColor[color], (icon as React.ReactElement<{ className?: string }>).props?.className || ""),
            })
          ) : (
            <Icon className={cn("w-9 h-9 sm:w-11 sm:h-11", iconColorByColor[color])} />
          )}
        </div>
        <h3 className={cn("font-semibold text-lg sm:text-xl tracking-tight", iconColorByColor[color])}>
          {title}
        </h3>
        <p className="mt-1 text-gray-600 text-sm sm:text-base">{countLabel}</p>
        <div className="mt-5">
          <div
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white",
              // button background uses the same color as icon
              color === 'blue' && 'bg-blue-600 hover:bg-blue-700',
              color === 'green' && 'bg-green-600 hover:bg-green-700',
              color === 'purple' && 'bg-purple-600 hover:bg-purple-700',
              color === 'indigo' && 'bg-indigo-600 hover:bg-indigo-700',
              color === 'amber' && 'bg-amber-500 hover:bg-amber-600',
              "transition-colors"
            )}
          >
            <span>{ctaLabel}</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  ) : (
    <div {...commonProps}>
      {/* subtle glass border overlay */}
      <div className="absolute inset-0 bg-white/5 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center p-8 sm:p-10 min-h-[220px]">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white flex items-center justify-center mb-5 sm:mb-6 shadow-sm">
          {iconIsElement ? (
            React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
              className: cn("w-9 h-9 sm:w-11 sm:h-11", iconColorByColor[color], (icon as React.ReactElement<{ className?: string }>).props?.className || ""),
            })
          ) : (
            <Icon className={cn("w-9 h-9 sm:w-11 sm:h-11", iconColorByColor[color])} />
          )}
        </div>
        <h3 className={cn("font-semibold text-lg sm:text-xl tracking-tight", iconColorByColor[color])}>
          {title}
        </h3>
        <p className="mt-1 text-gray-600 text-sm sm:text-base">{countLabel}</p>
        <div className="mt-5">
          <div
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white",
              // button background uses the same color as icon
              color === 'blue' && 'bg-blue-600 hover:bg-blue-700',
              color === 'green' && 'bg-green-600 hover:bg-green-700',
              color === 'purple' && 'bg-purple-600 hover:bg-purple-700',
              color === 'indigo' && 'bg-indigo-600 hover:bg-indigo-700',
              color === 'amber' && 'bg-amber-500 hover:bg-amber-600',
              "transition-colors"
            )}
          >
            <span>{ctaLabel}</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;

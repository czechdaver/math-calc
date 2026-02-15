import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'header' | 'glass';
    hoverEffect?: boolean;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
    ({ className, variant = 'default', hoverEffect = false, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-xl border shadow-sm transition-all duration-200",
                    {
                        "bg-card text-card-foreground": variant === 'default',
                        "glass-header": variant === 'header',
                        "glass-card": variant === 'glass',
                        "hover:shadow-md hover:-translate-y-0.5": hoverEffect,
                    },
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);
GlassCard.displayName = "GlassCard";

export default GlassCard;

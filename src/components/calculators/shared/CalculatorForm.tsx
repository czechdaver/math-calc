import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface CalculatorFormProps {
    children: ReactNode;
    columns?: 1 | 2;
    className?: string;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({
    children,
    columns = 1,
    className
}) => {
    return (
        <div
            className={cn(
                'grid gap-6',
                columns === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1',
                className
            )}
        >
            {children}
        </div>
    );
};

interface CalculatorInputGroupProps {
    label?: string;
    children: ReactNode;
    className?: string;
}

export const CalculatorInputGroup: React.FC<CalculatorInputGroupProps> = ({
    label,
    children,
    className
}) => {
    return (
        <div className={cn('bg-muted/30 p-4 rounded-xl border border-border/50 space-y-4', className)}>
            {label && (
                <h4 className="font-medium text-foreground text-sm flex items-center gap-2 mb-2">
                    {label}
                </h4>
            )}
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
};

interface CalculatorInputRowProps {
    children: ReactNode;
    className?: string;
}

export const CalculatorInputRow: React.FC<CalculatorInputRowProps> = ({
    children,
    className
}) => {
    return (
        <div className={cn('grid grid-cols-1 sm:grid-cols-2 gap-4 items-start', className)}>
            {children}
        </div>
    );
};

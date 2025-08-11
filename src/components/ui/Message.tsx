import React from 'react';
import { Info, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type MessageVariant = 'info' | 'warning' | 'success' | 'error';

interface MessageProps {
  variant?: MessageVariant;
  title?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<MessageVariant, { container: string; icon: React.ElementType; iconClass: string }> = {
  info: {
    container: 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 text-gray-700',
    icon: Info,
    iconClass: 'text-blue-600',
  },
  warning: {
    container: 'bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 text-gray-800',
    icon: AlertTriangle,
    iconClass: 'text-amber-600',
  },
  success: {
    container: 'bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 text-gray-800',
    icon: CheckCircle2,
    iconClass: 'text-emerald-600',
  },
  error: {
    container: 'bg-gradient-to-r from-rose-50 to-red-50 border border-red-200 text-gray-800',
    icon: XCircle,
    iconClass: 'text-red-600',
  },
};

export default function Message({ variant = 'info', title, children, className }: MessageProps) {
  const Icon = variantStyles[variant].icon;
  return (
    <div className={cn('p-4 rounded-lg', variantStyles[variant].container, className)}>
      <div className="flex items-start gap-3">
        <div className="shrink-0">
          <Icon className={cn('w-5 h-5', variantStyles[variant].iconClass)} />
        </div>
        <div className="space-y-1">
          {title && <p className="font-medium">{title}</p>}
          {children && <div className="text-sm leading-relaxed">{children}</div>}
        </div>
      </div>
    </div>
  );
}

// src/components/calculators/shared/CalculatorDisclaimer.tsx
import React from 'react';
import { AlertTriangle, Info, Shield, HelpCircle } from 'lucide-react';

interface CalculatorDisclaimerProps {
  type: 'warning' | 'info' | 'legal' | 'help';
  title?: string;
  children: React.ReactNode;
  className?: string;
  color?: 'blue' | 'green' | 'amber' | 'yellow' | 'red' | 'violet' | 'indigo';
  closeable?: boolean;
  onClose?: () => void;
}

const CalculatorDisclaimer: React.FC<CalculatorDisclaimerProps> = ({
  type,
  title,
  children,
  className = '',
  color,
  closeable = false,
  onClose,
}) => {
  // Auto-determine color based on type if not provided
  const defaultColors = {
    warning: 'amber',
    info: 'blue',
    legal: 'red',
    help: 'indigo',
  } as const;

  const effectiveColor = color || defaultColors[type];

  const colors = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      title: 'text-blue-800',
      text: 'text-blue-700',
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-600',
      title: 'text-green-800',
      text: 'text-green-700',
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: 'text-amber-600',
      title: 'text-amber-800',
      text: 'text-amber-700',
    },
    yellow: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: 'text-yellow-600',
      title: 'text-yellow-800',
      text: 'text-yellow-700',
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-600',
      title: 'text-red-800',
      text: 'text-red-700',
    },
    violet: {
      bg: 'bg-violet-50',
      border: 'border-violet-200',
      icon: 'text-violet-600',
      title: 'text-violet-800',
      text: 'text-violet-700',
    },
    indigo: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      icon: 'text-indigo-600',
      title: 'text-indigo-800',
      text: 'text-indigo-700',
    },
  } as const;

  const c = colors[effectiveColor] ?? colors.blue;

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className={`w-5 h-5 ${c.icon}`} />;
      case 'info':
        return <Info className={`w-5 h-5 ${c.icon}`} />;
      case 'legal':
        return <Shield className={`w-5 h-5 ${c.icon}`} />;
      case 'help':
        return <HelpCircle className={`w-5 h-5 ${c.icon}`} />;
      default:
        return <Info className={`w-5 h-5 ${c.icon}`} />;
    }
  };

  const getDefaultTitle = () => {
    switch (type) {
      case 'warning':
        return 'Upozornění';
      case 'info':
        return 'Informace';
      case 'legal':
        return 'Právní upozornění';
      case 'help':
        return 'Nápověda';
      default:
        return 'Informace';
    }
  };

  return (
    <div className={`${c.bg} ${c.border} border rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3 flex-1">
          {(title || !title) && (
            <h3 className={`text-sm font-medium ${c.title} mb-2`}>
              {title || getDefaultTitle()}
            </h3>
          )}
          <div className={`text-sm ${c.text}`}>
            {children}
          </div>
        </div>
        {closeable && onClose && (
          <div className="ml-auto flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className={`inline-flex rounded-md p-1.5 ${c.icon} hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-current focus:ring-white transition-colors`}
            >
              <span className="sr-only">Zavřít</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalculatorDisclaimer;
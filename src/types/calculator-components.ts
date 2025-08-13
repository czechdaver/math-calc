// src/types/calculator-components.ts
// Comprehensive TypeScript interfaces for calculator components

import { ReactNode } from 'react';

/* ============================================
   Enhanced Design System Types
   ============================================ */

export type ColorTheme = 'blue' | 'green' | 'amber' | 'yellow' | 'red' | 'violet' | 'indigo';

export type ComponentSize = 'sm' | 'md' | 'lg' | 'xl';

export type ComponentVariant = 'default' | 'outline' | 'ghost' | 'link';

/* ============================================
   Base Component Props
   ============================================ */

export interface BaseCalculatorComponentProps {
  id?: string;
  className?: string;
  color?: ColorTheme;
  disabled?: boolean;
  required?: boolean;
}

export interface BaseInputComponentProps extends BaseCalculatorComponentProps {
  label: string;
  helpText?: string;
  error?: string;
  labelIcon?: React.ComponentType<{ className?: string }>;
}

/* ============================================
   Calculator Input Components
   ============================================ */

export interface CalculatorInputProps extends BaseInputComponentProps {
  value: string;
  onChange: (value: string) => void;
  type?: 'number' | 'text';
  placeholder?: string;
  step?: string;
  min?: string;
  max?: string;
  unit?: string;
  quickAdjustSteps?: number[];
}

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface CalculatorSelectProps extends BaseInputComponentProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
}

export interface ToggleOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface CalculatorToggleProps extends BaseInputComponentProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: ToggleOption[];
  layout?: 'vertical' | 'horizontal';
}

export interface CalculatorRangeProps extends BaseInputComponentProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  showValue?: boolean;
  showMinMax?: boolean;
  formatValue?: (value: number) => string;
}

/* ============================================
   Calculator Display Components
   ============================================ */

export interface CalculatorResultProps extends BaseCalculatorComponentProps {
  title: string;
  value: string | number;
  description?: string;
  formula?: string;
  additionalInfo?: ReactNode;
  variant?: 'default' | 'enhanced' | 'compact';
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  description?: string;
}

export interface CalculatorChartProps extends BaseCalculatorComponentProps {
  data: ChartDataPoint[];
  type: 'bar' | 'pie' | 'line';
  title?: string;
  height?: number;
  showValues?: boolean;
  showLegend?: boolean;
}

export interface CalculatorDisclaimerProps extends BaseCalculatorComponentProps {
  type: 'warning' | 'info' | 'legal' | 'help';
  title?: string;
  children: ReactNode;
  closeable?: boolean;
  onClose?: () => void;
}

/* ============================================
   Calculator Layout Components
   ============================================ */

export interface CalculatorLayoutProps {
  title: string;
  description: string;
  category: string;
  calculatorId?: string;
  enhanced?: boolean;
  children: ReactNode;
  resultSection?: ReactNode;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  formula?: {
    latex: string;
    description: string;
  };
  examples?: {
    title: string;
    description: string;
    scenarios?: Array<{
      title: string;
      description: string;
      example?: string;
    }>;
  };
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  relatedCalculators?: Array<{
    id?: string;
    title: string;
    description: string;
    href: string;
    category: string;
  }>;
}

/* ============================================
   Calculator State Management
   ============================================ */

export interface CalculatorState<T = any> {
  inputs: T;
  result: any;
  errors: Record<string, string>;
  isValid: boolean;
  isCalculating: boolean;
}

export interface CalculatorActions<T = any> {
  setInput: (key: keyof T, value: any) => void;
  setInputs: (inputs: Partial<T>) => void;
  setResult: (result: any) => void;
  setError: (key: string, error: string) => void;
  clearErrors: () => void;
  calculate: () => void;
  reset: () => void;
}

/* ============================================
   Calculator Configuration
   ============================================ */

export interface CalculatorConfig {
  id: string;
  title: string;
  description: string;
  category: string;
  enhanced: boolean;
  formula?: {
    latex: string;
    description: string;
  };
  inputs: Array<{
    id: string;
    type: 'input' | 'select' | 'toggle' | 'range';
    label: string;
    required: boolean;
    validation?: {
      min?: number;
      max?: number;
      pattern?: string;
      custom?: (value: any) => string | null;
    };
  }>;
  calculations: {
    realTime: boolean;
    debounceMs?: number;
    dependencies?: string[];
  };
  display: {
    resultFormat: 'number' | 'currency' | 'percentage' | 'custom';
    precision?: number;
    showFormula?: boolean;
    showChart?: boolean;
  };
}

/* ============================================
   Template System Types
   ============================================ */

export interface CalculatorTemplate {
  type: 'simple' | 'complex' | 'multi-step' | 'chart' | 'table';
  config: CalculatorConfig;
  component: React.ComponentType<any>;
  pageWrapper: React.ComponentType<any>;
}

export interface TemplateGeneratorOptions {
  calculatorId: string;
  name: string;
  category: string;
  type: CalculatorTemplate['type'];
  enhanced: boolean;
  inputs: Array<{
    id: string;
    type: string;
    label: string;
    required?: boolean;
  }>;
  formula?: {
    latex: string;
    description: string;
  };
}

/* ============================================
   Validation and Error Handling
   ============================================ */

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any) => boolean;
}

export interface FieldValidation {
  rules: ValidationRule[];
  isValid: boolean;
  errors: string[];
}

export interface FormValidation {
  fields: Record<string, FieldValidation>;
  isValid: boolean;
  hasErrors: boolean;
}

/* ============================================
   Enhanced UI System Types
   ============================================ */

export interface ColorSystemColors {
  50: string;
  100: string;
  200: string;
  500: string;
  600: string;
  700: string;
}

export interface EnhancedUITheme {
  colors: Record<ColorTheme, ColorSystemColors>;
  gradients: Record<ColorTheme, string>;
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  typography: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  transitions: {
    fast: string;
    normal: string;
    slow: string;
  };
}

/* ============================================
   Export all types for easy importing
   ============================================ */

export type {
  // Re-export commonly used types
  ReactNode,
};

// Helper type for component refs
export type ComponentRef<T = HTMLElement> = React.RefObject<T>;

// Helper type for event handlers
export type EventHandler<T = Event> = (event: T) => void;
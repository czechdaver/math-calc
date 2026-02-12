// src/components/calculators/shared/CashFlowEditor.tsx
'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/Button';
import { AlertCircle, Plus, Minus } from 'lucide-react';

export interface CashFlow {
  period: number;
  amount: number;
}

interface CashFlowEditorProps {
  cashFlows: CashFlow[];
  onChange: (cashFlows: CashFlow[]) => void;
  errors?: Record<string, string>;
  labels: {
    title: string;
    addPeriod: string;
    beginning: string;
    year: string;
    currency: string;
    negativeHint: string;
    positiveHint: string;
    periodZeroHint: string;
  };
  minFlows?: number;
}

const CashFlowEditor: React.FC<CashFlowEditorProps> = ({
  cashFlows,
  onChange,
  errors = {},
  labels,
  minFlows = 2,
}) => {
  const addCashFlow = () => {
    const newPeriod = Math.max(...cashFlows.map(cf => cf.period)) + 1;
    onChange([...cashFlows, { period: newPeriod, amount: 0 }]);
  };

  const removeCashFlow = (index: number) => {
    if (cashFlows.length > minFlows) {
      onChange(cashFlows.filter((_, i) => i !== index));
    }
  };

  const updateCashFlow = (index: number, amount: number) => {
    const updated = [...cashFlows];
    updated[index] = { ...updated[index], amount };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{labels.title}</Label>
        <Button type="button" onClick={addCashFlow} size="sm" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {labels.addPeriod}
        </Button>
      </div>

      {errors.cashFlows && (
        <p className="text-destructive text-xs flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {errors.cashFlows}
        </p>
      )}

      <div className="space-y-3">
        {cashFlows.map((flow, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="flex-shrink-0 w-16 text-sm font-medium text-muted-foreground">
              {flow.period === 0 ? labels.beginning : `${labels.year} ${flow.period}`}
            </div>
            <div className="flex-1">
              <Input
                type="number"
                value={flow.amount}
                onChange={(e) => updateCashFlow(index, parseFloat(e.target.value) || 0)}
                placeholder="0"
                className={`${errors[`cashFlow_${index}`] ? 'border-destructive' : ''} ${flow.amount < 0 ? 'text-red-600' : 'text-green-600'}`}
                step="1000"
              />
              {errors[`cashFlow_${index}`] && (
                <p className="text-destructive text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors[`cashFlow_${index}`]}
                </p>
              )}
            </div>
            <div className="flex-shrink-0 text-xs text-muted-foreground">{labels.currency}</div>
            {cashFlows.length > minFlows && (
              <Button type="button" onClick={() => removeCashFlow(index)} size="sm" variant="outline" className="flex-shrink-0">
                <Minus className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="text-xs text-muted-foreground space-y-1">
        <p>&bull; {labels.negativeHint}</p>
        <p>&bull; {labels.positiveHint}</p>
        <p>&bull; {labels.periodZeroHint}</p>
      </div>
    </div>
  );
};

export default CashFlowEditor;

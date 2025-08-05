// src/components/calculators/CistaMzdaCalculator.refactored.tsx
import React from 'react';
import { useTranslations } from 'next-intl';
import CalculatorBase from './CalculatorBase';
import type { CalculatorInput, CalculatorResult } from './CalculatorBase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Info } from 'lucide-react';

type Country = 'cr' | 'sk';

const CistaMzdaCalculator: React.FC = () => {
  const t = useTranslations('netSalaryCalculator');

  const inputs: CalculatorInput[] = [
    {
      id: 'hrubaMzda',
      label: t('gross_salary'),
      type: 'number',
      required: true,
      min: 0,
      step: '100',
      placeholder: '30000',
      helpText: t('enter_gross_salary'),
      unit: t('currency_czk')
    },
    {
      id: 'zeme',
      label: t('country'),
      type: 'select',
      required: true,
      options: [
        { value: 'cr', label: t('czech_republic') },
        { value: 'sk', label: t('slovakia') }
      ],
      defaultValue: 'cr',
      helpText: t('select_country_help')
    }
  ];

  const calculate = (inputs: Record<string, any>): CalculatorResult => {
    const hrubaMzda = parseFloat(inputs.hrubaMzda) || 0;
    const zeme = inputs.zeme as Country || 'cr';

    // Tax and insurance rates based on country
    const rates = {
      cr: {
        socialni: 0.065,
        zdravotni: 0.045,
        dan: 0.15
      },
      sk: {
        socialni: 0.094,
        zdravotni: 0.04,
        dan: 0.19
      }
    };

    const { socialni, zdravotni, dan } = rates[zeme];
    
    // Calculate deductions
    const socialniSrazka = hrubaMzda * socialni;
    const zdravotniSrazka = hrubaMzda * zdravotni;
    
    // Simplified tax calculation (without tax credits, etc.)
    const zakladProDan = hrubaMzda - socialniSrazka - zdravotniSrazka;
    const danSrazka = Math.max(0, zakladProDan * dan);
    
    // Calculate net salary
    const cistaMzda = hrubaMzda - socialniSrazka - zdravotniSrazka - danSrazka;
    
    // Calculate percentages of gross salary
    const celkemSrazky = hrubaMzda - cistaMzda;
    const procentoCelkem = (celkemSrazky / hrubaMzda) * 100;
    const procentoDan = (danSrazka / hrubaMzda) * 100;
    const procentoSocialni = (socialniSrazka / hrubaMzda) * 100;
    const procentoZdravotni = (zdravotniSrazka / hrubaMzda) * 100;

    return {
      value: cistaMzda.toFixed(2),
      details: [
        { 
          label: t('gross_salary'), 
          value: hrubaMzda.toFixed(2), 
          unit: t('currency_czk') 
        },
        { 
          label: t('net_salary'), 
          value: cistaMzda.toFixed(2), 
          unit: t('currency_czk'),
          highlight: true 
        },
        { 
          label: t('total_deductions'), 
          value: celkemSrazky.toFixed(2), 
          unit: `${t('currency_czk')} (${procentoCelkem.toFixed(1)}%)` 
        },
        { 
          label: t('tax'), 
          value: danSrazka.toFixed(2), 
          unit: `${t('currency_czk')} (${procentoDan.toFixed(1)}%)` 
        },
        { 
          label: t('social_insurance'), 
          value: socialniSrazka.toFixed(2), 
          unit: `${t('currency_czk')} (${procentoSocialni.toFixed(1)}%)` 
        },
        { 
          label: t('health_insurance'), 
          value: zdravotniSrazka.toFixed(2), 
          unit: `${t('currency_czk')} (${procentoZdravotni.toFixed(1)}%)` 
        }
      ]
    };
  };

  // Custom result component to display the calculation results
  const ResultComponent = ({ result }: { result: CalculatorResult }) => (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{t('salary_calculation_results')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.details?.slice(0, 2).map((detail, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border ${detail.highlight ? 'bg-primary/5 border-primary/20' : ''}`}
              >
                <div className="text-sm font-medium text-muted-foreground">
                  {detail.label}
                </div>
                <div className={`text-xl font-bold ${detail.highlight ? 'text-primary' : ''}`}>
                  {detail.value} {detail.unit}
                </div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {result.details?.slice(2).map((detail, index) => (
              <div key={index} className="p-4 rounded-lg border">
                <div className="text-sm font-medium text-muted-foreground">
                  {detail.label}
                </div>
                <div className="text-lg font-semibold">
                  {detail.value} <span className="text-sm text-muted-foreground">{detail.unit}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-sm text-muted-foreground flex items-start gap-2 mt-4 p-4 bg-muted/30 rounded-md">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>{t('salary_calculation_note')}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <CalculatorBase
      id="net-salary-calculator"
      title={t('net_salary_calculator')}
      description={t('net_salary_calculator_description')}
      category="finance"
      seo={{
        title: t('seo.net_salary_calculator_title'),
        description: t('seo.net_salary_calculator_description'),
        keywords: [
          t('seo.net_salary_keyword_1'),
          t('seo.net_salary_keyword_2'),
          t('seo.net_salary_keyword_3')
        ]
      }}
      inputs={inputs}
      calculate={calculate}
      resultComponent={ResultComponent}
    />
  );
};

export default CistaMzdaCalculator;

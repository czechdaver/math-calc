// src/components/calculators/TimeCalculator.tsx
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { CalculatorInput, CalculatorResult, CalculatorSelect } from './shared';
import { Card, CardContent } from '@/components/ui/Card';
import { Clock, Plus, Minus } from 'lucide-react';
import { useTimeCalculator, formatTime } from '@/hooks/useTimeCalculator';

const TimeCalculator: React.FC = () => {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;

  const {
    operation, setOperation,
    hours1, setHours1, minutes1, setMinutes1, seconds1, setSeconds1,
    hours2, setHours2, minutes2, setMinutes2, seconds2, setSeconds2,
    result, errors, time1Formatted, time2Formatted,
  } = useTimeCalculator({
    errorMessages: {
      hours: t('time_error_hours'),
      minutes: t('time_error_minutes'),
      seconds: t('time_error_seconds'),
    }
  });

  const operationOptions = [
    { value: 'add', label: t('time_operation_add') },
    { value: 'subtract', label: t('time_operation_subtract') },
  ];

  const timeInputGroup = (
    prefix: string,
    h: string, setH: (v: string) => void,
    m: string, setM: (v: string) => void,
    s: string, setS: (v: string) => void,
    hErr?: string, mErr?: string, sErr?: string,
    formatted?: string
  ) => (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-4">
        <CalculatorInput id={`hours${prefix}`} label={t('time_label_hours')} value={h}
          onChange={setH} placeholder="0" min="0" max="999" step="1" error={hErr} className="!mb-0" />
        <CalculatorInput id={`minutes${prefix}`} label={t('time_label_minutes')} value={m}
          onChange={setM} placeholder="0" min="0" max="59" step="1" error={mErr} className="!mb-0" />
        <CalculatorInput id={`seconds${prefix}`} label={t('time_label_seconds')} value={s}
          onChange={setS} placeholder="0" min="0" max="59" step="1" error={sErr} className="!mb-0" />
      </div>
      <div className="text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-sm font-mono">
          <Clock className="w-4 h-4" />{formatted}
        </span>
      </div>
    </div>
  );

  const resultSection = result ? (
    <CalculatorResult
      title={t('time_result_label')}
      value={formatTime(result.hours, result.minutes, result.seconds)}
      description={result.operation === 'add' ? t('time_result_sum') : t('time_result_difference')}
      additionalInfo={
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div><div className="text-lg font-bold">{result.hours}</div><div className="text-muted-foreground">{t('common.hours')}</div></div>
            <div><div className="text-lg font-bold">{result.minutes}</div><div className="text-muted-foreground">{t('common.minutes')}</div></div>
            <div><div className="text-lg font-bold">{result.seconds}</div><div className="text-muted-foreground">{t('common.seconds')}</div></div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center text-sm border-t pt-4">
            <div><div className="text-xs text-muted-foreground">{t('time_total')}</div><div className="font-bold">{result.totalHours.toLocaleString(locale)}</div><div className="text-xs text-muted-foreground">{t('common.hours')}</div></div>
            <div><div className="text-xs text-muted-foreground">{t('time_total')}</div><div className="font-bold">{result.totalMinutes.toLocaleString(locale)}</div><div className="text-xs text-muted-foreground">{t('common.minutes')}</div></div>
            <div><div className="text-xs text-muted-foreground">{t('time_total')}</div><div className="font-bold">{result.totalSeconds.toLocaleString(locale)}</div><div className="text-xs text-muted-foreground">{t('common.seconds')}</div></div>
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <div className="flex justify-between"><span>{t('time_first_time')}:</span><span className="font-mono">{time1Formatted}</span></div>
            <div className="flex justify-between"><span>{result.operation === 'add' ? t('time_add_verb') : t('time_subtract_verb')}:</span><span className="font-mono">{time2Formatted}</span></div>
            <div className="border-t pt-1 flex justify-between font-semibold"><span>{t('time_result_label')}:</span><span className="font-mono">{formatTime(result.hours, result.minutes, result.seconds)}</span></div>
          </div>
        </div>
      }
    />
  ) : null;

  return (
    <SimpleCalculatorLayout
      title={t('calculators.time.title')}
      description={t('calculators.time.description')}
      category={t('categories.practical')}
      calculatorId="time"
      seo={{
        title: t('time_seo_title'),
        description: t('time_seo_description'),
        keywords: t('time_seo_keywords').split(',')
      }}
      formula={{
        latex: String.raw`T_{\text{result}} = T_1 \pm T_2`,
        description: t('time_formula_description')
      }}
      resultSection={resultSection}
      examples={{
        title: t('time_examples_title'),
        description: t('time_examples_description'),
        scenarios: [
          { title: t('time_example_1_title'), description: t('time_example_1_desc'), example: t('time_example_1_example') },
          { title: t('time_example_2_title'), description: t('time_example_2_desc'), example: t('time_example_2_example') },
          { title: t('time_example_3_title'), description: t('time_example_3_desc'), example: t('time_example_3_example') },
        ]
      }}
      faq={[
        { question: t('time_faq_1_q'), answer: t('time_faq_1_a') },
        { question: t('time_faq_2_q'), answer: t('time_faq_2_a') },
        { question: t('time_faq_3_q'), answer: t('time_faq_3_a') },
        { question: t('time_faq_4_q'), answer: t('time_faq_4_a') },
      ]}
      schemaData={{ applicationCategory: "UtilitiesApplication", operatingSystem: "Any" }}
    >
      <div className="space-y-6">
        <CalculatorSelect id="operation" label={t('time_label_operation')}
          value={operation} onChange={setOperation} options={operationOptions}
          helpText={operation === 'add' ? t('time_operation_add') : t('time_operation_subtract')} />

        <div className="space-y-2">
          <div className="text-sm font-medium text-foreground flex items-center gap-2">
            <Clock className="w-4 h-4" />{t('time_first_time')}
          </div>
          {timeInputGroup('1', hours1, setHours1, minutes1, setMinutes1, seconds1, setSeconds1,
            errors.hours1, errors.minutes1, errors.seconds1, time1Formatted)}
        </div>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-muted rounded-full">
            {operation === 'add' ? <Plus className="w-5 h-5 text-muted-foreground" /> : <Minus className="w-5 h-5 text-muted-foreground" />}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium text-foreground flex items-center gap-2">
            <Clock className="w-4 h-4" />{t('time_second_time')}
          </div>
          {timeInputGroup('2', hours2, setHours2, minutes2, setMinutes2, seconds2, setSeconds2,
            errors.hours2, errors.minutes2, errors.seconds2, time2Formatted)}
        </div>

        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4 text-center">
            <div className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">{t('time_calculation_summary')}</div>
            <div className="text-lg font-mono text-blue-900 dark:text-blue-200">
              {time1Formatted} {operation === 'add' ? '+' : '-'} {time2Formatted}
            </div>
          </CardContent>
        </Card>
      </div>
    </SimpleCalculatorLayout>
  );
};

export default TimeCalculator;

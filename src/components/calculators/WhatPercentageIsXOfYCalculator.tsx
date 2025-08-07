// REFACTORING NEEDED: This calculator has TypeScript errors and needs to be fully migrated
// to the standard calculator pattern. Priority: Medium
// Issues: Missing CalculatorBase import, type errors in map function

// src/components/calculators/WhatPercentageIsXOfYCalculator.tsx
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { CalculatorInput, CalculatorResult } from './shared';
import CalculatorBase from './CalculatorBase';

const KolikProcentJeXZYCalculator: React.FC = () => {
  const t = useTranslations();

  // Define calculator inputs
  const inputs = [
    {
      id: 'x',
      label: t('hodnota_x_label') || 'Hodnota X',
      type: 'number' as const,
      required: true,
      placeholder: t('zadejte_hodnotu') || 'Zadejte hodnotu',
      min: 0,
      step: 'any',
      helpText: t('zadejte_cislo') || 'Zadejte číslo',
    },
    {
      id: 'y',
      label: t('hodnota_y_label') || 'Hodnota Y',
      type: 'number' as const,
      required: true,
      placeholder: t('zadejte_hodnotu') || 'Zadejte hodnotu',
      min: 0.0001, // Prevent division by zero
      step: 'any',
      helpText: t('zadejte_cislo_vetsi_než_nula') || 'Zadejte číslo větší než nula',
    },
  ];

  // Calculate the percentage
  const calculate = (values: Record<string, any>) => {
    const x = parseFloat(values.x || '0');
    const y = parseFloat(values.y || '1');
    
    if (isNaN(x) || isNaN(y) || y === 0) {
      return { value: null };
    }

    const percentage = (x / y) * 100;

    return {
      value: percentage,
      details: [
        { 
          label: t('vysledek') || 'Výsledek', 
          value: percentage.toFixed(2), 
          unit: '%', 
          highlight: true 
        },
        { 
          label: t('hodnota_x') || 'Hodnota X', 
          value: x.toLocaleString(),
        },
        { 
          label: t('z_hodnoty_y') || 'z hodnoty Y', 
          value: y.toLocaleString(),
        },
      ],
      formula: 'výsledek = (X / Y) × 100',
      explanation: t('vypocet_percentages_x_z_y') || 'Výpočet, kolik procent tvoří hodnota X z hodnoty Y',
    };
  };

  // Custom result component to display the calculation details
  const ResultComponent = ({ result }: { result: { value: number | null; formula?: string; details?: string; explanation?: string; } }) => {
    if (result.value === null) {
      return (
        <div className="text-center py-4 text-muted-foreground">
          {t('zadejte_platne_hodnoty') || 'Zadejte platné hodnoty pro výpočet'}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
          <div className="text-sm font-medium text-primary/80 mb-1">
            {t('vysledek') || 'Výsledek'}
          </div>
          <div className="text-2xl font-bold">
            {result.value.toFixed(2)} %
          </div>
        </div>

        {result.details && (
          <div className="text-sm text-gray-600 mt-2">
            {result.details}
          </div>
        )}

        {result.formula && (
          <div className="mt-4 p-3 bg-muted/50 rounded text-sm font-mono">
            <div className="font-semibold mb-1">{t('pouzity_vzorec') || 'Použitý vzorec'}:</div>
            <div>{result.formula}</div>
          </div>
        )}

        {result.explanation && (
          <div className="mt-3 text-sm text-muted-foreground">
            {result.explanation}
          </div>
        )}
      </div>
    );
  };

  return (
    <CalculatorBase
      id="percentage-of-number"
      title={t('kolik_procent_je_x_z_y_title') || 'Kolik procent je X z Y?'}
      description={
        t('kalkulacka_percentages_popis') || 
        'Vypočítejte, kolik procent tvoří jedna hodnota z druhé. Zadejte hodnoty X a Y a zjistěte výsledek.'
      }
      category="finance"
      seo={{
        title: t('seo.kolik_procent_je_x_z_y_title') || 'Kalkulačka: Kolik procent je X z Y?',
        description: 
          t('seo.kolik_procent_je_x_z_y_description') || 
          'Snadno vypočítejte, kolik procent tvoří jedna hodnota z druhé. Ideální pro výpočet slev, přírůstků a dalších procentuálních vztahů.',
        keywords: [
          t('seo.klicove_slovo_percentages') || 'percentages',
          t('seo.klicove_slovo_kalkulacka') || 'kalkulačka',
          t('seo.klicove_slovo_vypocet') || 'výpočet',
          t('seo.klicove_slovo_xy') || 'x z y',
          t('seo.klicove_slovo_matematika') || 'matematika',
        ],
      }}
      inputs={inputs}
      calculate={calculate}
      resultComponent={ResultComponent}
    />
  );
};

export default KolikProcentJeXZYCalculator;

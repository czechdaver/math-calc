// src/components/calculators/TimeCalculator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Calculator as CalcIcon, Clock, Plus, Minus, Timer } from 'lucide-react';

interface TimeResult {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  totalMinutes: number;
  totalHours: number;
  operation: string;
  isValid: boolean;
}

const TimeCalculator: React.FC = () => {
  const t = useTranslations();
  const [operation, setOperation] = useState<string>('add');
  
  // First time
  const [hours1, setHours1] = useState<string>('2');
  const [minutes1, setMinutes1] = useState<string>('30');
  const [seconds1, setSeconds1] = useState<string>('45');
  
  // Second time
  const [hours2, setHours2] = useState<string>('1');
  const [minutes2, setMinutes2] = useState<string>('15');
  const [seconds2, setSeconds2] = useState<string>('30');
  
  const [result, setResult] = useState<TimeResult | null>(null);
  const [errors, setErrors] = useState<{ 
    hours1?: string; minutes1?: string; seconds1?: string;
    hours2?: string; minutes2?: string; seconds2?: string;
  }>({});

  // Format time component with leading zero
  const formatTimeComponent = (value: number): string => {
    return value.toString().padStart(2, '0');
  };

  // Format time as HH:MM:SS
  const formatTime = (hours: number, minutes: number, seconds: number): string => {
    return `${formatTimeComponent(hours)}:${formatTimeComponent(minutes)}:${formatTimeComponent(seconds)}`;
  };

  // Convert time to total seconds
  const timeToSeconds = (hours: number, minutes: number, seconds: number): number => {
    return hours * 3600 + minutes * 60 + seconds;
  };

  // Convert seconds back to time components
  const secondsToTime = (totalSeconds: number): { hours: number; minutes: number; seconds: number } => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return { hours, minutes, seconds };
  };

  // Add two times
  const addTimes = (
    h1: number, m1: number, s1: number,
    h2: number, m2: number, s2: number
  ): TimeResult => {
    const totalSeconds1 = timeToSeconds(h1, m1, s1);
    const totalSeconds2 = timeToSeconds(h2, m2, s2);
    const resultSeconds = totalSeconds1 + totalSeconds2;
    
    const { hours, minutes, seconds } = secondsToTime(resultSeconds);
    
    return {
      hours,
      minutes,
      seconds,
      totalSeconds: resultSeconds,
      totalMinutes: Math.floor(resultSeconds / 60),
      totalHours: Math.floor(resultSeconds / 3600),
      operation: 'add',
      isValid: true
    };
  };

  // Subtract two times
  const subtractTimes = (
    h1: number, m1: number, s1: number,
    h2: number, m2: number, s2: number
  ): TimeResult => {
    const totalSeconds1 = timeToSeconds(h1, m1, s1);
    const totalSeconds2 = timeToSeconds(h2, m2, s2);
    const resultSeconds = Math.abs(totalSeconds1 - totalSeconds2);
    
    const { hours, minutes, seconds } = secondsToTime(resultSeconds);
    
    return {
      hours,
      minutes,
      seconds,
      totalSeconds: resultSeconds,
      totalMinutes: Math.floor(resultSeconds / 60),
      totalHours: Math.floor(resultSeconds / 3600),
      operation: 'subtract',
      isValid: true
    };
  };

  // Get operation description
  const getOperationDescription = (op: string): string => {
    switch (op) {
      case 'add': return 'Sčítání časů';
      case 'subtract': return 'Odčítání časů';
      default: return 'Sčítání časů';
    }
  };

  // Validation function
  const validateInputs = (
    h1: string, m1: string, s1: string,
    h2: string, m2: string, s2: string
  ) => {
    const newErrors: { 
      hours1?: string; minutes1?: string; seconds1?: string;
      hours2?: string; minutes2?: string; seconds2?: string;
    } = {};
    
    const hours1Num = parseInt(h1);
    const minutes1Num = parseInt(m1);
    const seconds1Num = parseInt(s1);
    const hours2Num = parseInt(h2);
    const minutes2Num = parseInt(m2);
    const seconds2Num = parseInt(s2);

    // Validate first time
    if (!h1 || isNaN(hours1Num) || hours1Num < 0 || hours1Num > 999) {
      newErrors.hours1 = 'Zadejte platné hodiny (0-999)';
    }
    if (!m1 || isNaN(minutes1Num) || minutes1Num < 0 || minutes1Num > 59) {
      newErrors.minutes1 = 'Zadejte platné minuty (0-59)';
    }
    if (!s1 || isNaN(seconds1Num) || seconds1Num < 0 || seconds1Num > 59) {
      newErrors.seconds1 = 'Zadejte platné sekundy (0-59)';
    }

    // Validate second time
    if (!h2 || isNaN(hours2Num) || hours2Num < 0 || hours2Num > 999) {
      newErrors.hours2 = 'Zadejte platné hodiny (0-999)';
    }
    if (!m2 || isNaN(minutes2Num) || minutes2Num < 0 || minutes2Num > 59) {
      newErrors.minutes2 = 'Zadejte platné minuty (0-59)';
    }
    if (!s2 || isNaN(seconds2Num) || seconds2Num < 0 || seconds2Num > 59) {
      newErrors.seconds2 = 'Zadejte platné sekundy (0-59)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Effect for real-time calculation
  useEffect(() => {
    if (validateInputs(hours1, minutes1, seconds1, hours2, minutes2, seconds2)) {
      const h1 = parseInt(hours1);
      const m1 = parseInt(minutes1);
      const s1 = parseInt(seconds1);
      const h2 = parseInt(hours2);
      const m2 = parseInt(minutes2);
      const s2 = parseInt(seconds2);

      let calculatedResult: TimeResult;

      if (operation === 'add') {
        calculatedResult = addTimes(h1, m1, s1, h2, m2, s2);
      } else {
        calculatedResult = subtractTimes(h1, m1, s1, h2, m2, s2);
      }

      setResult(calculatedResult);
    } else {
      setResult(null);
    }
  }, [hours1, minutes1, seconds1, hours2, minutes2, seconds2, operation]);

  // Calculator input form
  const calculatorForm = (
    <div className="space-y-6">
      {/* Operation Type */}
      <div className="space-y-2">
        <Label htmlFor="operation" className="text-sm font-medium">
          Operace
        </Label>
        <Select value={operation} onValueChange={setOperation}>
          <SelectTrigger>
            <SelectValue placeholder="Vyberte operaci" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="add">Sčítání časů</SelectItem>
            <SelectItem value="subtract">Odčítání časů</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-gray-500 text-xs">
          {getOperationDescription(operation)}
        </p>
      </div>

      {/* First Time */}
      <div className="space-y-4">
        <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          První čas
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hours1" className="text-sm font-medium">Hodiny</Label>
            <Input
              id="hours1"
              type="number"
              value={hours1}
              onChange={(e) => setHours1(e.target.value)}
              placeholder="2"
              className={`${errors.hours1 ? 'border-red-500' : ''}`}
              min="0"
              max="999"
              step="1"
            />
            {errors.hours1 && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.hours1}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="minutes1" className="text-sm font-medium">Minuty</Label>
            <Input
              id="minutes1"
              type="number"
              value={minutes1}
              onChange={(e) => setMinutes1(e.target.value)}
              placeholder="30"
              className={`${errors.minutes1 ? 'border-red-500' : ''}`}
              min="0"
              max="59"
              step="1"
            />
            {errors.minutes1 && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.minutes1}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="seconds1" className="text-sm font-medium">Sekundy</Label>
            <Input
              id="seconds1"
              type="number"
              value={seconds1}
              onChange={(e) => setSeconds1(e.target.value)}
              placeholder="45"
              className={`${errors.seconds1 ? 'border-red-500' : ''}`}
              min="0"
              max="59"
              step="1"
            />
            {errors.seconds1 && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.seconds1}
              </p>
            )}
          </div>
        </div>
        
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded text-sm font-mono">
            <Clock className="w-4 h-4" />
            {formatTime(parseInt(hours1 || '0'), parseInt(minutes1 || '0'), parseInt(seconds1 || '0'))}
          </div>
        </div>
      </div>

      {/* Operation Symbol */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
          {operation === 'add' ? (
            <Plus className="w-5 h-5 text-gray-600" />
          ) : (
            <Minus className="w-5 h-5 text-gray-600" />
          )}
        </div>
      </div>

      {/* Second Time */}
      <div className="space-y-4">
        <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Druhý čas
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hours2" className="text-sm font-medium">Hodiny</Label>
            <Input
              id="hours2"
              type="number"
              value={hours2}
              onChange={(e) => setHours2(e.target.value)}
              placeholder="1"
              className={`${errors.hours2 ? 'border-red-500' : ''}`}
              min="0"
              max="999"
              step="1"
            />
            {errors.hours2 && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.hours2}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="minutes2" className="text-sm font-medium">Minuty</Label>
            <Input
              id="minutes2"
              type="number"
              value={minutes2}
              onChange={(e) => setMinutes2(e.target.value)}
              placeholder="15"
              className={`${errors.minutes2 ? 'border-red-500' : ''}`}
              min="0"
              max="59"
              step="1"
            />
            {errors.minutes2 && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.minutes2}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="seconds2" className="text-sm font-medium">Sekundy</Label>
            <Input
              id="seconds2"
              type="number"
              value={seconds2}
              onChange={(e) => setSeconds2(e.target.value)}
              placeholder="30"
              className={`${errors.seconds2 ? 'border-red-500' : ''}`}
              min="0"
              max="59"
              step="1"
            />
            {errors.seconds2 && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.seconds2}
              </p>
            )}
          </div>
        </div>
        
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded text-sm font-mono">
            <Clock className="w-4 h-4" />
            {formatTime(parseInt(hours2 || '0'), parseInt(minutes2 || '0'), parseInt(seconds2 || '0'))}
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm font-medium text-blue-800 mb-2">
              Výpočet času
            </div>
            <div className="text-lg font-mono text-blue-900">
              {formatTime(parseInt(hours1 || '0'), parseInt(minutes1 || '0'), parseInt(seconds1 || '0'))} {' '}
              {operation === 'add' ? '+' : '-'} {' '}
              {formatTime(parseInt(hours2 || '0'), parseInt(minutes2 || '0'), parseInt(seconds2 || '0'))}
            </div>
            <div className="text-xs text-blue-600 mt-1">
              {getOperationDescription(operation)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Results section
  const resultsSection = result ? (
    <div className="space-y-6">
      {/* Main Result */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-4 p-6 bg-green-50 rounded-xl">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-900 font-mono">
              {formatTime(result.hours, result.minutes, result.seconds)}
            </div>
            <div className="text-sm text-green-700 mt-1">
              Výsledek
            </div>
            <div className="text-xs text-green-600 mt-1">
              {result.operation === 'add' ? 'Součet časů' : 'Rozdíl časů'}
            </div>
          </div>
          <Timer className="w-8 h-8 text-green-600" />
        </div>
      </div>

      {/* Time Breakdown */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-blue-800">
              {result.hours}
            </div>
            <div className="text-sm text-blue-700 mt-1">Hodin</div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-purple-800">
              {result.minutes}
            </div>
            <div className="text-sm text-purple-700 mt-1">Minut</div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-orange-800">
              {result.seconds}
            </div>
            <div className="text-sm text-orange-700 mt-1">Sekund</div>
          </CardContent>
        </Card>
      </div>

      {/* Total Values */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4 text-center">
            <div className="text-sm text-gray-700 mb-1">Celkem</div>
            <div className="text-lg font-bold text-gray-800">
              {result.totalHours.toLocaleString('cs-CZ')}
            </div>
            <div className="text-xs text-gray-600 mt-1">hodin</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4 text-center">
            <div className="text-sm text-gray-700 mb-1">Celkem</div>
            <div className="text-lg font-bold text-gray-800">
              {result.totalMinutes.toLocaleString('cs-CZ')}
            </div>
            <div className="text-xs text-gray-600 mt-1">minut</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4 text-center">
            <div className="text-sm text-gray-700 mb-1">Celkem</div>
            <div className="text-lg font-bold text-gray-800">
              {result.totalSeconds.toLocaleString('cs-CZ')}
            </div>
            <div className="text-xs text-gray-600 mt-1">sekund</div>
          </CardContent>
        </Card>
      </div>

      {/* Calculation Details */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CalcIcon className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Výpočet</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>První čas:</span>
                  <span className="font-mono">{formatTime(parseInt(hours1), parseInt(minutes1), parseInt(seconds1))}</span>
                </div>
                <div className="flex justify-between">
                  <span>{result.operation === 'add' ? 'Přičíst' : 'Odečíst'}:</span>
                  <span className="font-mono">{formatTime(parseInt(hours2), parseInt(minutes2), parseInt(seconds2))}</span>
                </div>
                <div className="border-t pt-1 flex justify-between font-semibold">
                  <span>Výsledek:</span>
                  <span className="font-mono">{formatTime(result.hours, result.minutes, result.seconds)}</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Operace: {getOperationDescription(result.operation)} | 
                Celkem: {result.totalSeconds.toLocaleString('cs-CZ')} sekund | 
                Formát: HH:MM:SS
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ) : (
    <div className="text-center py-8 text-gray-500">
      <CalcIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
      <p>{t('common.enter_values')}</p>
    </div>
  );

  return (
    <SimpleCalculatorLayout
      title={t('calculators.time.title')}
      description={t('calculators.time.description')}
      category={t('categories.practical')}
      seo={{
        title: "Kalkulátor času - Sčítání a odčítání času HH:MM:SS | MathCalc",
        description: "Bezplatný kalkulátor času. Sčítejte a odčítejte časy, vypočítejte pracovní dobu, přestávky a časové intervaly.",
        keywords: ["čas", "kalkulátor času", "sčítání času", "odčítání času", "pracovní doba", "přestávky", "HH:MM:SS", "hodiny minuty sekundy"]
      }}
      formula={{
        latex: "Výsledek = Čas_1 \\pm Čas_2",
        description: "Časy se převedou na sekundy, provedou se operace a výsledek se převede zpět na HH:MM:SS formát."
      }}
      examples={{
        title: "Příklady výpočtu času",
        description: "Praktické použití kalkulátoru času",
        scenarios: [
          {
            title: "Pracovní doba",
            description: "8:30:00 + 1:15:30 = 9:45:30",
            example: "Celková pracovní doba včetně přesčasů"
          },
          {
            title: "Doba přestávky",
            description: "12:30:00 - 11:45:15 = 0:44:45",
            example: "Délka polední přestávky"
          },
          {
            title: "Celkový čas projektu",
            description: "2:15:30 + 3:45:20 + 1:30:10",
            example: "Součet více časových úseků"
          }
        ]
      }}
      faq={[
        {
          question: "Jak funguje sčítání časů?",
          answer: "Časy se převedou na sekundy, sečtou se a výsledek se převede zpět na hodiny:minuty:sekundy. Pokud minuty nebo sekundy překročí 59, automaticky se převedou na vyšší jednotku."
        },
        {
          question: "Co se stane při odčítání většího času?",
          answer: "Kalkulátor automaticky vrátí absolutní hodnotu rozdílu, takže výsledek je vždy kladný. Například 1:00:00 - 2:00:00 = 1:00:00."
        },
        {
          question: "Lze počítat s více než 24 hodinami?",
          answer: "Ano, kalkulátor podporuje časy až do 999 hodin, což je užitečné pro výpočty projektových časů, pracovních hodin za měsíc apod."
        },
        {
          question: "Jak použít pro výpočet pracovní doby?",
          answer: "Sečtěte všechny pracovní úseky nebo odečtěte čas začátku od času konce. Kalkulátor automaticky zpracuje přenosy mezi jednotkami."
        }
      ]}
      relatedCalculators={[
        {
          title: "Kalkulátor věku",
          description: "Výpočet přesného věku a dní života",
          href: "/calculator/prakticke-vypocty/kalkulacka-3",
          category: "Praktické"
        },
        {
          title: "Kalkulátor spropitného",
          description: "Výpočet spropitného pro restaurace",
          href: "/calculator/prakticke-vypocty/kalkulacka-1",
          category: "Praktické"
        },
        {
          title: "Kalkulátor slev",
          description: "Výpočet slev a úspor",
          href: "/calculator/prakticke-vypocty/kalkulacka-2",
          category: "Praktické"
        },
        {
          title: "Převodník jednotek",
          description: "Převod mezi různými jednotkami",
          href: "/calculator/prevodnik-jednotek",
          category: "Praktické"
        }
      ]}
      schemaData={{
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any"
      }}
      resultSection={resultsSection}
    >
      {calculatorForm}
    </SimpleCalculatorLayout>
  );
};

export default TimeCalculator;

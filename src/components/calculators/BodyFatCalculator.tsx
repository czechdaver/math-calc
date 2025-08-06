// src/components/calculators/BodyFatCalculator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Calculator as CalcIcon, Activity, User, Target } from 'lucide-react';

interface BodyFatResult {
  bodyFatPercentage: number;
  category: string;
  categoryColor: string;
  fatMass: number;
  leanMass: number;
  bmi: number;
  method: string;
  isHealthy: boolean;
  isValid: boolean;
}

const BodyFatCalculator: React.FC = () => {
  const t = useTranslations();
  const [weight, setWeight] = useState<string>('70');
  const [height, setHeight] = useState<string>('170');
  const [age, setAge] = useState<string>('30');
  const [gender, setGender] = useState<string>('male');
  const [method, setMethod] = useState<string>('navy');
  const [neck, setNeck] = useState<string>('37');
  const [waist, setWaist] = useState<string>('85');
  const [hip, setHip] = useState<string>('95');
  const [result, setResult] = useState<BodyFatResult | null>(null);
  const [errors, setErrors] = useState<{ 
    weight?: string; height?: string; age?: string; 
    neck?: string; waist?: string; hip?: string;
  }>({});

  const formatNumber = (num: number, decimals: number = 1): string => {
    return num.toLocaleString('cs-CZ', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const calculateNavyMethod = (heightCm: number, neckCm: number, waistCm: number, hipCm: number, isMale: boolean): number => {
    if (isMale) {
      const bodyDensity = 1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm);
      return (495 / bodyDensity) - 450;
    } else {
      const bodyDensity = 1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.22100 * Math.log10(heightCm);
      return (495 / bodyDensity) - 450;
    }
  };

  const calculateBMIMethod = (bmi: number, age: number, isMale: boolean): number => {
    if (isMale) {
      return (1.20 * bmi) + (0.23 * age) - 16.2;
    } else {
      return (1.20 * bmi) + (0.23 * age) - 5.4;
    }
  };

  const getBodyFatCategory = (bodyFat: number, isMale: boolean): { category: string; color: string; isHealthy: boolean } => {
    if (isMale) {
      if (bodyFat < 6) return { category: 'Velmi nízký', color: 'text-red-600', isHealthy: false };
      if (bodyFat < 14) return { category: 'Atletický', color: 'text-green-600', isHealthy: true };
      if (bodyFat < 18) return { category: 'Fitness', color: 'text-blue-600', isHealthy: true };
      if (bodyFat < 25) return { category: 'Průměrný', color: 'text-yellow-600', isHealthy: true };
      return { category: 'Obézní', color: 'text-red-600', isHealthy: false };
    } else {
      if (bodyFat < 16) return { category: 'Velmi nízký', color: 'text-red-600', isHealthy: false };
      if (bodyFat < 21) return { category: 'Atletický', color: 'text-green-600', isHealthy: true };
      if (bodyFat < 25) return { category: 'Fitness', color: 'text-blue-600', isHealthy: true };
      if (bodyFat < 32) return { category: 'Průměrný', color: 'text-yellow-600', isHealthy: true };
      return { category: 'Obézní', color: 'text-red-600', isHealthy: false };
    }
  };

  const calculateBodyFat = (
    weightNum: number, heightNum: number, ageNum: number, genderStr: string,
    methodStr: string, neckNum: number, waistNum: number, hipNum: number
  ): BodyFatResult => {
    const isMale = genderStr === 'male';
    const bmi = weightNum / Math.pow(heightNum / 100, 2);
    
    let bodyFatPercentage: number;
    if (methodStr === 'navy') {
      bodyFatPercentage = calculateNavyMethod(heightNum, neckNum, waistNum, hipNum, isMale);
    } else {
      bodyFatPercentage = calculateBMIMethod(bmi, ageNum, isMale);
    }
    
    bodyFatPercentage = Math.max(3, Math.min(50, bodyFatPercentage));
    const { category, color, isHealthy } = getBodyFatCategory(bodyFatPercentage, isMale);
    const fatMass = (bodyFatPercentage / 100) * weightNum;
    const leanMass = weightNum - fatMass;

    return {
      bodyFatPercentage: Math.round(bodyFatPercentage * 10) / 10,
      category, categoryColor: color, fatMass: Math.round(fatMass * 10) / 10,
      leanMass: Math.round(leanMass * 10) / 10, bmi: Math.round(bmi * 10) / 10,
      method: methodStr, isHealthy, isValid: true
    };
  };

  const validateInputs = (weightStr: string, heightStr: string, ageStr: string, neckStr: string, waistStr: string, hipStr: string) => {
    const newErrors: any = {};
    const weightNum = parseFloat(weightStr);
    const heightNum = parseFloat(heightStr);
    const ageNum = parseFloat(ageStr);

    if (!weightStr || isNaN(weightNum) || weightNum < 30 || weightNum > 300) {
      newErrors.weight = 'Zadejte platnou váhu (30-300 kg)';
    }
    if (!heightStr || isNaN(heightNum) || heightNum < 100 || heightNum > 250) {
      newErrors.height = 'Zadejte platnou výšku (100-250 cm)';
    }
    if (!ageStr || isNaN(ageNum) || ageNum < 15 || ageNum > 120) {
      newErrors.age = 'Zadejte platný věk (15-120 let)';
    }

    if (method === 'navy') {
      const neckNum = parseFloat(neckStr);
      const waistNum = parseFloat(waistStr);
      const hipNum = parseFloat(hipStr);

      if (!neckStr || isNaN(neckNum) || neckNum < 20 || neckNum > 60) {
        newErrors.neck = 'Zadejte platný obvod krku (20-60 cm)';
      }
      if (!waistStr || isNaN(waistNum) || waistNum < 50 || waistNum > 200) {
        newErrors.waist = 'Zadejte platný obvod pasu (50-200 cm)';
      }
      if (gender === 'female' && (!hipStr || isNaN(hipNum) || hipNum < 60 || hipNum > 200)) {
        newErrors.hip = 'Zadejte platný obvod boků (60-200 cm)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (validateInputs(weight, height, age, neck, waist, hip)) {
      const weightNum = parseFloat(weight);
      const heightNum = parseFloat(height);
      const ageNum = parseFloat(age);
      const neckNum = parseFloat(neck);
      const waistNum = parseFloat(waist);
      const hipNum = parseFloat(hip);

      setResult(calculateBodyFat(weightNum, heightNum, ageNum, gender, method, neckNum, waistNum, hipNum));
    } else {
      setResult(null);
    }
  }, [weight, height, age, gender, method, neck, waist, hip]);

  const calculatorForm = (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="method" className="text-sm font-medium">Metoda výpočtu</Label>
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger>
            <SelectValue placeholder="Vyberte metodu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="navy">US Navy metoda (přesnější)</SelectItem>
            <SelectItem value="bmi">BMI odhad (jednodušší)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-gray-500 text-xs">
          {method === 'navy' ? 'Vyžaduje měření obvodu krku, pasu a boků' : 'Odhad založený na BMI a věku'}
        </p>
      </div>

      <div className="space-y-4">
        <div className="text-sm font-medium text-gray-700">Základní údaje</div>
        
        <div className="space-y-2">
          <Label htmlFor="weight" className="text-sm font-medium">Váha</Label>
          <div className="relative">
            <Input
              id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)}
              placeholder="70" className={`pr-12 ${errors.weight ? 'border-red-500' : ''}`}
              min="30" max="300" step="0.1"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">kg</span>
          </div>
          {errors.weight && (
            <p className="text-red-500 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />{errors.weight}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="height" className="text-sm font-medium">Výška</Label>
          <div className="relative">
            <Input
              id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)}
              placeholder="170" className={`pr-12 ${errors.height ? 'border-red-500' : ''}`}
              min="100" max="250" step="1"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">cm</span>
          </div>
          {errors.height && (
            <p className="text-red-500 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />{errors.height}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="age" className="text-sm font-medium">Věk</Label>
          <div className="relative">
            <Input
              id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)}
              placeholder="30" className={`pr-12 ${errors.age ? 'border-red-500' : ''}`}
              min="15" max="120" step="1"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">let</span>
          </div>
          {errors.age && (
            <p className="text-red-500 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />{errors.age}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender" className="text-sm font-medium">Pohlaví</Label>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger>
              <SelectValue placeholder="Vyberte pohlaví" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Muž</SelectItem>
              <SelectItem value="female">Žena</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {method === 'navy' && (
        <div className="space-y-4">
          <div className="text-sm font-medium text-gray-700">Tělesné míry (US Navy metoda)</div>
          
          <div className="space-y-2">
            <Label htmlFor="neck" className="text-sm font-medium">Obvod krku</Label>
            <div className="relative">
              <Input
                id="neck" type="number" value={neck} onChange={(e) => setNeck(e.target.value)}
                placeholder="37" className={`pr-12 ${errors.neck ? 'border-red-500' : ''}`}
                min="20" max="60" step="0.5"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">cm</span>
            </div>
            {errors.neck && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />{errors.neck}
              </p>
            )}
            <p className="text-gray-500 text-xs">Měřte pod ohryzkem, nejužší místo</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="waist" className="text-sm font-medium">Obvod pasu</Label>
            <div className="relative">
              <Input
                id="waist" type="number" value={waist} onChange={(e) => setWaist(e.target.value)}
                placeholder="85" className={`pr-12 ${errors.waist ? 'border-red-500' : ''}`}
                min="50" max="200" step="0.5"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">cm</span>
            </div>
            {errors.waist && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />{errors.waist}
              </p>
            )}
            <p className="text-gray-500 text-xs">
              {gender === 'male' ? 'Měřte v úrovni pupku' : 'Měřte nejužší místo'}
            </p>
          </div>

          {gender === 'female' && (
            <div className="space-y-2">
              <Label htmlFor="hip" className="text-sm font-medium">Obvod boků</Label>
              <div className="relative">
                <Input
                  id="hip" type="number" value={hip} onChange={(e) => setHip(e.target.value)}
                  placeholder="95" className={`pr-12 ${errors.hip ? 'border-red-500' : ''}`}
                  min="60" max="200" step="0.5"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">cm</span>
              </div>
              {errors.hip && (
                <p className="text-red-500 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />{errors.hip}
                </p>
              )}
              <p className="text-gray-500 text-xs">Měřte nejširší místo boků</p>
            </div>
          )}
        </div>
      )}

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm font-medium text-blue-800 mb-2">Vaše údaje</div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="font-semibold text-blue-900">Profil</div>
                <div className="text-blue-700">{gender === 'male' ? 'Muž' : 'Žena'}, {age} let</div>
              </div>
              <div>
                <div className="font-semibold text-blue-900">Tělo</div>
                <div className="text-blue-700">{weight} kg, {height} cm</div>
              </div>
            </div>
            <div className="mt-2 text-xs text-blue-600">
              Metoda: {method === 'navy' ? 'US Navy (přesnější)' : 'BMI odhad (jednodušší)'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const resultsSection = result ? (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-4 p-6 bg-green-50 rounded-xl">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-900">
              {formatNumber(result.bodyFatPercentage)}%
            </div>
            <div className="text-sm text-green-700 mt-1">Tělesný tuk</div>
            <div className="text-xs text-green-600 mt-1">
              {result.method === 'navy' ? 'US Navy metoda' : 'BMI odhad'}
            </div>
          </div>
          <Activity className="w-8 h-8 text-green-600" />
        </div>
      </div>

      <Card className={`${result.isHealthy ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Target className="w-5 h-5" />
            <div className={`text-sm font-medium ${result.categoryColor}`}>
              {result.category}
            </div>
          </div>
          <div className="text-xs text-gray-600">
            {result.isHealthy ? 'Zdravé rozpětí' : 'Mimo zdravé rozpětí'}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-blue-800">
              {formatNumber(result.fatMass)} kg
            </div>
            <div className="text-sm text-blue-700 mt-1">Tuková hmota</div>
            <div className="text-xs text-blue-600 mt-1">
              {formatNumber(result.bodyFatPercentage)}% z celkové váhy
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-green-800">
              {formatNumber(result.leanMass)} kg
            </div>
            <div className="text-sm text-green-700 mt-1">Svalová hmota</div>
            <div className="text-xs text-green-600 mt-1">
              {formatNumber(100 - result.bodyFatPercentage)}% z celkové váhy
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4 text-center">
          <div className="text-sm text-gray-700 mb-2">Pro porovnání:</div>
          <div className="text-lg font-bold text-gray-800">
            BMI: {formatNumber(result.bmi)}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Tělesný tuk je přesnější než BMI pro fitness
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Co je tělesný tuk?</h4>
              <p className="text-gray-600 text-sm">
                Tělesný tuk je procento vaší celkové váhy tvořené tukem. Na rozdíl od BMI 
                rozlišuje mezi tukovou a svalovou hmotou, což poskytuje přesnější obraz o vaší kondici.
              </p>
              <div className="mt-2 text-xs text-gray-500">
                Metoda: {result.method === 'navy' ? 'US Navy (přesnější)' : 'BMI odhad'} | 
                Tělesný tuk: {formatNumber(result.bodyFatPercentage)}% | 
                Kategorie: {result.category}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ) : (
    <div className="text-center py-8 text-gray-500">
      <CalcIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
      <p>Zadejte vaše údaje pro výpočet tělesného tuku</p>
    </div>
  );

  return (
    <SimpleCalculatorLayout
      title="Tělesný tuk kalkulátor"
      description="Vypočítejte procento tělesného tuku pomocí US Navy metody nebo BMI odhadu. Zjistěte složení těla, tukovou a svalovou hmotu s doporučeními pro zdraví."
      category="Zdraví"
      seo={{
        title: "Tělesný tuk kalkulátor - US Navy metoda BMI odhad | MathCalc",
        description: "Bezplatný kalkulátor tělesného tuku. Výpočet pomocí US Navy metody nebo BMI s analýzou složení těla a zdravotními doporučeními.",
        keywords: ["tělesný tuk", "body fat", "US Navy", "BMI", "složení těla", "tuková hmota", "svalová hmota", "fitness", "zdraví"]
      }}
      formula={{
        latex: "BF\\% = \\frac{495}{1.0324 - 0.19077 \\times \\log_{10}(pas - krk) + 0.15456 \\times \\log_{10}(výška)} - 450",
        description: "US Navy vzorec pro muže. Pro ženy se používají jiné koeficienty a zahrnuje se obvod boků."
      }}
      examples={{
        title: "Příklady výpočtu tělesného tuku",
        description: "Porovnání různých metod a profilů",
        scenarios: [
          {
            title: "Muž, atletický typ",
            description: "Navy: 12%, BMI odhad: 15%",
            example: "Navy metoda je přesnější pro sportovce"
          },
          {
            title: "Žena, průměrná kondice",
            description: "Navy: 28%, BMI odhad: 25%",
            example: "Ženy mají přirozeně vyšší tělesný tuk"
          },
          {
            title: "Rozdíl mezi metodami",
            description: "Navy vs BMI: rozdíl 2-5%",
            example: "Navy metoda je obecně přesnější"
          }
        ]
      }}
      faq={[
        {
          question: "Která metoda je přesnější?",
          answer: "US Navy metoda je obecně přesnější, protože používá skutečné tělesné míry. BMI odhad je jednodušší, ale méně přesný, zejména u sportovců s vyšší svalovou hmotou."
        },
        {
          question: "Jaký je zdravý tělesný tuk?",
          answer: "Pro muže: 6-24% (atletický 6-13%, fitness 14-17%, průměrný 18-24%). Pro ženy: 16-31% (atletický 16-20%, fitness 21-24%, průměrný 25-31%)."
        },
        {
          question: "Jak měřit tělesné míry?",
          answer: "Krk: nejužší místo pod ohryzkem. Pas u mužů: v úrovni pupku, u žen: nejužší místo. Boky u žen: nejširší místo. Měřte ráno na lačno."
        },
        {
          question: "Proč je tělesný tuk lepší než BMI?",
          answer: "BMI nerozlišuje mezi svalovou a tukovou hmotou. Sportovci mohou mít vysoké BMI kvůli svalům, ale nízký tělesný tuk. Tělesný tuk je přesnější ukazatel kondice."
        }
      ]}
      relatedCalculators={[
        {
          title: "BMI kalkulátor",
          description: "Výpočet indexu tělesné hmotnosti",
          href: "/calculator/bmi",
          category: "Zdraví"
        },
        {
          title: "Ideální váha kalkulátor",
          description: "Robinson Miller Devine Hamwi vzorce",
          href: "/calculator/fitness-a-zdravi/kalkulacka-3",
          category: "Zdraví"
        },
        {
          title: "BMR kalkulátor",
          description: "Bazální metabolismus",
          href: "/calculator/fitness-a-zdravi/kalkulacka-2",
          category: "Zdraví"
        },
        {
          title: "Kalorie kalkulátor",
          description: "Denní potřeba kalorií",
          href: "/calculator/fitness-a-zdravi/kalkulacka-1",
          category: "Zdraví"
        }
      ]}
      schemaData={{
        applicationCategory: "HealthApplication",
        operatingSystem: "Any"
      }}
      resultSection={resultsSection}
    >
      {calculatorForm}
    </SimpleCalculatorLayout>
  );
};

export default BodyFatCalculator;

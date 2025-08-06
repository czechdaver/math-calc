// src/components/calculators/IdealWeightCalculator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Calculator as CalcIcon, Scale, User, Target, TrendingUp } from 'lucide-react';

interface IdealWeightResult {
  robinson: number;
  miller: number;
  devine: number;
  hamwi: number;
  healthy: { min: number; max: number };
  current?: number;
  height: number;
  gender: string;
  age: number;
  isValid: boolean;
}

const IdealWeightCalculator: React.FC = () => {
  const t = useTranslations();
  const [height, setHeight] = useState<string>('170');
  const [gender, setGender] = useState<string>('male');
  const [age, setAge] = useState<string>('30');
  const [currentWeight, setCurrentWeight] = useState<string>('');
  const [formula, setFormula] = useState<string>('robinson');
  const [result, setResult] = useState<IdealWeightResult | null>(null);
  const [errors, setErrors] = useState<{ 
    height?: string; age?: string; currentWeight?: string 
  }>({});

  // Format number with Czech locale
  const formatNumber = (num: number, decimals: number = 1): string => {
    return num.toLocaleString('cs-CZ', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  // Robinson Formula (1983) - most commonly used
  const calculateRobinson = (heightCm: number, isMale: boolean): number => {
    const heightInches = heightCm / 2.54;
    if (isMale) {
      return 52 + 1.9 * (heightInches - 60);
    } else {
      return 49 + 1.7 * (heightInches - 60);
    }
  };

  // Miller Formula (1983)
  const calculateMiller = (heightCm: number, isMale: boolean): number => {
    const heightInches = heightCm / 2.54;
    if (isMale) {
      return 56.2 + 1.41 * (heightInches - 60);
    } else {
      return 53.1 + 1.36 * (heightInches - 60);
    }
  };

  // Devine Formula (1974) - original
  const calculateDevine = (heightCm: number, isMale: boolean): number => {
    const heightInches = heightCm / 2.54;
    if (isMale) {
      return 50 + 2.3 * (heightInches - 60);
    } else {
      return 45.5 + 2.3 * (heightInches - 60);
    }
  };

  // Hamwi Formula (1964)
  const calculateHamwi = (heightCm: number, isMale: boolean): number => {
    const heightInches = heightCm / 2.54;
    if (isMale) {
      return 48 + 2.7 * (heightInches - 60);
    } else {
      return 45.5 + 2.2 * (heightInches - 60);
    }
  };

  // Healthy BMI range (18.5-24.9)
  const calculateHealthyRange = (heightCm: number): { min: number; max: number } => {
    const heightM = heightCm / 100;
    return {
      min: 18.5 * heightM * heightM,
      max: 24.9 * heightM * heightM
    };
  };

  // Get formula description
  const getFormulaDescription = (formulaType: string): string => {
    switch (formulaType) {
      case 'robinson': return 'Robinson (1983) - nejpoužívanější';
      case 'miller': return 'Miller (1983) - moderní přístup';
      case 'devine': return 'Devine (1974) - původní vzorec';
      case 'hamwi': return 'Hamwi (1964) - konzervativní';
      default: return 'Robinson';
    }
  };

  // Calculate ideal weight with all formulas
  const calculateIdealWeight = (
    heightNum: number,
    genderStr: string,
    ageNum: number,
    currentWeightNum?: number
  ): IdealWeightResult => {
    const isMale = genderStr === 'male';
    
    const robinson = calculateRobinson(heightNum, isMale);
    const miller = calculateMiller(heightNum, isMale);
    const devine = calculateDevine(heightNum, isMale);
    const hamwi = calculateHamwi(heightNum, isMale);
    const healthy = calculateHealthyRange(heightNum);

    return {
      robinson: Math.round(robinson * 10) / 10,
      miller: Math.round(miller * 10) / 10,
      devine: Math.round(devine * 10) / 10,
      hamwi: Math.round(hamwi * 10) / 10,
      healthy,
      current: currentWeightNum,
      height: heightNum,
      gender: genderStr,
      age: ageNum,
      isValid: true
    };
  };

  // Get primary ideal weight based on selected formula
  const getPrimaryIdealWeight = (result: IdealWeightResult): number => {
    switch (formula) {
      case 'miller': return result.miller;
      case 'devine': return result.devine;
      case 'hamwi': return result.hamwi;
      default: return result.robinson;
    }
  };

  // Get weight status
  const getWeightStatus = (current: number, ideal: number): { status: string; color: string; icon: React.ReactNode } => {
    const diff = current - ideal;
    const percentDiff = Math.abs(diff) / ideal * 100;

    if (percentDiff <= 5) {
      return { status: 'Ideální váha', color: 'text-green-600', icon: <Target className="w-4 h-4" /> };
    } else if (diff > 0) {
      if (percentDiff <= 15) {
        return { status: 'Mírně nadváha', color: 'text-yellow-600', icon: <TrendingUp className="w-4 h-4" /> };
      } else {
        return { status: 'Nadváha', color: 'text-red-600', icon: <TrendingUp className="w-4 h-4" /> };
      }
    } else {
      if (percentDiff <= 15) {
        return { status: 'Mírně podváha', color: 'text-blue-600', icon: <Target className="w-4 h-4" /> };
      } else {
        return { status: 'Podváha', color: 'text-red-600', icon: <Target className="w-4 h-4" /> };
      }
    }
  };

  // Validation function
  const validateInputs = (heightStr: string, ageStr: string, currentWeightStr: string) => {
    const newErrors: { height?: string; age?: string; currentWeight?: string } = {};
    
    const heightNum = parseFloat(heightStr);
    const ageNum = parseFloat(ageStr);
    const currentWeightNum = currentWeightStr ? parseFloat(currentWeightStr) : undefined;

    if (!heightStr || isNaN(heightNum) || heightNum < 100 || heightNum > 250) {
      newErrors.height = 'Zadejte platnou výšku (100-250 cm)';
    }

    if (!ageStr || isNaN(ageNum) || ageNum < 15 || ageNum > 120) {
      newErrors.age = 'Zadejte platný věk (15-120 let)';
    }

    if (currentWeightStr && (!isNaN(currentWeightNum!) && (currentWeightNum! < 30 || currentWeightNum! > 300))) {
      newErrors.currentWeight = 'Zadejte platnou váhu (30-300 kg)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Effect for real-time calculation
  useEffect(() => {
    if (validateInputs(height, age, currentWeight)) {
      const heightNum = parseFloat(height);
      const ageNum = parseFloat(age);
      const currentWeightNum = currentWeight ? parseFloat(currentWeight) : undefined;

      setResult(calculateIdealWeight(heightNum, gender, ageNum, currentWeightNum));
    } else {
      setResult(null);
    }
  }, [height, gender, age, currentWeight, formula]);

  // Calculator input form
  const calculatorForm = (
    <div className="space-y-6">
      {/* Formula Selection */}
      <div className="space-y-2">
        <Label htmlFor="formula" className="text-sm font-medium">
          Vzorec pro výpočet
        </Label>
        <Select value={formula} onValueChange={setFormula}>
          <SelectTrigger>
            <SelectValue placeholder="Vyberte vzorec" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="robinson">Robinson (doporučeno)</SelectItem>
            <SelectItem value="miller">Miller</SelectItem>
            <SelectItem value="devine">Devine</SelectItem>
            <SelectItem value="hamwi">Hamwi</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-gray-500 text-xs">
          {getFormulaDescription(formula)}
        </p>
      </div>

      {/* Personal Information */}
      <div className="space-y-4">
        <div className="text-sm font-medium text-gray-700">Osobní údaje</div>
        
        {/* Height */}
        <div className="space-y-2">
          <Label htmlFor="height" className="text-sm font-medium">
            Výška
          </Label>
          <div className="relative">
            <Input
              id="height"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="170"
              className={`pr-12 ${errors.height ? 'border-red-500' : ''}`}
              min="100"
              max="250"
              step="1"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              cm
            </span>
          </div>
          {errors.height && (
            <p className="text-red-500 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.height}
            </p>
          )}
          <p className="text-gray-500 text-xs">
            Vaše výška v centimetrech
          </p>
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label htmlFor="gender" className="text-sm font-medium">
            Pohlaví
          </Label>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger>
              <SelectValue placeholder="Vyberte pohlaví" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Muž</SelectItem>
              <SelectItem value="female">Žena</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-gray-500 text-xs">
            Pohlaví ovlivňuje ideální váhu
          </p>
        </div>

        {/* Age */}
        <div className="space-y-2">
          <Label htmlFor="age" className="text-sm font-medium">
            Věk
          </Label>
          <div className="relative">
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="30"
              className={`pr-12 ${errors.age ? 'border-red-500' : ''}`}
              min="15"
              max="120"
              step="1"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              let
            </span>
          </div>
          {errors.age && (
            <p className="text-red-500 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.age}
            </p>
          )}
          <p className="text-gray-500 text-xs">
            Váš věk v letech
          </p>
        </div>

        {/* Current Weight (optional) */}
        <div className="space-y-2">
          <Label htmlFor="currentWeight" className="text-sm font-medium">
            Současná váha (volitelné)
          </Label>
          <div className="relative">
            <Input
              id="currentWeight"
              type="number"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
              placeholder="70"
              className={`pr-12 ${errors.currentWeight ? 'border-red-500' : ''}`}
              min="30"
              max="300"
              step="0.1"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              kg
            </span>
          </div>
          {errors.currentWeight && (
            <p className="text-red-500 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.currentWeight}
            </p>
          )}
          <p className="text-gray-500 text-xs">
            Pro porovnání s ideální váhou
          </p>
        </div>
      </div>

      {/* Personal Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm font-medium text-blue-800 mb-2">
              Vaše údaje
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="font-semibold text-blue-900">Profil</div>
                <div className="text-blue-700">{gender === 'male' ? 'Muž' : 'Žena'}, {age} let</div>
              </div>
              <div>
                <div className="font-semibold text-blue-900">Výška</div>
                <div className="text-blue-700">{height} cm</div>
              </div>
            </div>
            <div className="mt-2 text-xs text-blue-600">
              Vzorec: {getFormulaDescription(formula)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Results section
  const resultsSection = result ? (
    <div className="space-y-6">
      {/* Main Result - Primary Ideal Weight */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-4 p-6 bg-green-50 rounded-xl">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-900">
              {formatNumber(getPrimaryIdealWeight(result))} kg
            </div>
            <div className="text-sm text-green-700 mt-1">
              Ideální váha
            </div>
            <div className="text-xs text-green-600 mt-1">
              {getFormulaDescription(formula).split(' ')[0]} vzorec
            </div>
          </div>
          <Scale className="w-8 h-8 text-green-600" />
        </div>
      </div>

      {/* Current Weight Status */}
      {result.current && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              {getWeightStatus(result.current, getPrimaryIdealWeight(result)).icon}
              <div className={`text-sm font-medium ${getWeightStatus(result.current, getPrimaryIdealWeight(result)).color}`}>
                {getWeightStatus(result.current, getPrimaryIdealWeight(result)).status}
              </div>
            </div>
            <div className="text-lg font-bold text-gray-800">
              Rozdíl: {formatNumber(result.current - getPrimaryIdealWeight(result), 1)} kg
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Současná váha: {formatNumber(result.current)} kg
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formula Comparison */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className={`${formula === 'robinson' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
          <CardContent className="p-3 text-center">
            <div className={`text-sm font-medium mb-1 ${formula === 'robinson' ? 'text-green-700' : 'text-gray-700'}`}>
              Robinson
            </div>
            <div className={`text-lg font-bold ${formula === 'robinson' ? 'text-green-800' : 'text-gray-800'}`}>
              {formatNumber(result.robinson)} kg
            </div>
            <div className={`text-xs mt-1 ${formula === 'robinson' ? 'text-green-600' : 'text-gray-600'}`}>
              Nejpoužívanější
            </div>
          </CardContent>
        </Card>

        <Card className={`${formula === 'miller' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
          <CardContent className="p-3 text-center">
            <div className={`text-sm font-medium mb-1 ${formula === 'miller' ? 'text-blue-700' : 'text-gray-700'}`}>
              Miller
            </div>
            <div className={`text-lg font-bold ${formula === 'miller' ? 'text-blue-800' : 'text-gray-800'}`}>
              {formatNumber(result.miller)} kg
            </div>
            <div className={`text-xs mt-1 ${formula === 'miller' ? 'text-blue-600' : 'text-gray-600'}`}>
              Moderní
            </div>
          </CardContent>
        </Card>

        <Card className={`${formula === 'devine' ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'}`}>
          <CardContent className="p-3 text-center">
            <div className={`text-sm font-medium mb-1 ${formula === 'devine' ? 'text-purple-700' : 'text-gray-700'}`}>
              Devine
            </div>
            <div className={`text-lg font-bold ${formula === 'devine' ? 'text-purple-800' : 'text-gray-800'}`}>
              {formatNumber(result.devine)} kg
            </div>
            <div className={`text-xs mt-1 ${formula === 'devine' ? 'text-purple-600' : 'text-gray-600'}`}>
              Původní
            </div>
          </CardContent>
        </Card>

        <Card className={`${formula === 'hamwi' ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'}`}>
          <CardContent className="p-3 text-center">
            <div className={`text-sm font-medium mb-1 ${formula === 'hamwi' ? 'text-orange-700' : 'text-gray-700'}`}>
              Hamwi
            </div>
            <div className={`text-lg font-bold ${formula === 'hamwi' ? 'text-orange-800' : 'text-gray-800'}`}>
              {formatNumber(result.hamwi)} kg
            </div>
            <div className={`text-xs mt-1 ${formula === 'hamwi' ? 'text-orange-600' : 'text-gray-600'}`}>
              Konzervativní
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Healthy BMI Range */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm text-blue-800 font-medium mb-3">Zdravé rozpětí váhy (BMI 18.5-24.9):</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-blue-700">Minimální zdravá váha:</span>
                <span className="font-mono text-blue-900 font-semibold">{formatNumber(result.healthy.min)} kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-700">Maximální zdravá váha:</span>
                <span className="font-mono text-blue-900 font-semibold">{formatNumber(result.healthy.max)} kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-700">Rozpětí:</span>
                <span className="font-mono text-blue-900">{formatNumber(result.healthy.max - result.healthy.min)} kg</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weight Information */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Co je ideální váha?</h4>
              <p className="text-gray-600 text-sm">
                Ideální váha je teoretická váha pro vaši výšku a pohlaví podle různých vědeckých vzorců. 
                Nezohledňuje svalovou hmotu, kostní strukturu nebo věk, proto je lepší používat jako orientační hodnotu.
              </p>
              <div className="mt-2 text-xs text-gray-500">
                Vzorec: {getFormulaDescription(formula)} | 
                Ideální váha: {formatNumber(getPrimaryIdealWeight(result))} kg | 
                Výška: {result.height} cm, {result.gender === 'male' ? 'muž' : 'žena'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ) : (
    <div className="text-center py-8 text-gray-500">
      <CalcIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
      <p>Zadejte vaše údaje pro výpočet ideální váhy</p>
    </div>
  );

  return (
    <SimpleCalculatorLayout
      title="Ideální váha kalkulátor"
      description="Vypočítejte ideální váhu pomocí různých vědeckých vzorců (Robinson, Miller, Devine, Hamwi). Porovnejte s vaší současnou váhou a zdravým BMI rozpětím."
      category="Zdraví"
      seo={{
        title: "Ideální váha kalkulátor - Robinson Miller Devine Hamwi | MathCalc",
        description: "Bezplatný kalkulátor ideální váhy. Výpočet pomocí Robinson, Miller, Devine a Hamwi vzorců s porovnáním zdravého BMI rozpětí.",
        keywords: ["ideální váha", "Robinson", "Miller", "Devine", "Hamwi", "zdravá váha", "BMI", "kalkulátor váhy", "fitness"]
      }}
      formula={{
        latex: "IBW_{Robinson} = 52 + 1.9 \\times (výška_{palce} - 60)",
        description: "Robinson vzorec pro muže. Pro ženy: 49 + 1.7 × (výška_palce - 60). Další vzorce používají jiné koeficienty."
      }}
      examples={{
        title: "Příklady výpočtu ideální váhy",
        description: "Porovnání různých vzorců pro různé profily",
        scenarios: [
          {
            title: "Muž, 180cm",
            description: "Robinson: 75.6 kg, Miller: 71.4 kg, Devine: 79.5 kg",
            example: "Rozdíly mezi vzorci mohou být až 8 kg"
          },
          {
            title: "Žena, 165cm",
            description: "Robinson: 58.4 kg, Miller: 56.2 kg, Devine: 59.0 kg",
            example: "Ženy mají obecně nižší ideální váhu"
          },
          {
            title: "Zdravé BMI rozpětí pro 170cm",
            description: "53.5 - 72.3 kg (BMI 18.5-24.9)",
            example: "Širší rozpětí než jednotlivé vzorce"
          }
        ]
      }}
      faq={[
        {
          question: "Který vzorec je nejpřesnější?",
          answer: "Robinson vzorec (1983) je nejpoužívanější a obecně nejpřesnější pro většinu lidí. Miller je modernější alternativa, Devine je původní vzorec a Hamwi je konzervativnější."
        },
        {
          question: "Proč se výsledky vzorců liší?",
          answer: "Každý vzorec byl vyvinut na základě různých populačních studií a používá jiné koeficienty. Rozdíly 5-10 kg jsou normální a všechny jsou validní odhady."
        },
        {
          question: "Je ideální váha skutečně ideální?",
          answer: "Ideální váha je pouze orientační. Nezohledňuje svalovou hmotu, kostní strukturu, věk nebo zdravotní stav. Zdravé BMI rozpětí (18.5-24.9) je často přesnější."
        },
        {
          question: "Jak se liší od BMI?",
          answer: "Vzorce ideální váhy počítají konkrétní váhu pro vaši výšku. BMI je poměr váhy k výšce na druhou a poskytuje rozpětí zdravých vah."
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
          title: "Kalorie kalkulátor",
          description: "Denní potřeba kalorií",
          href: "/calculator/fitness-a-zdravi/kalkulacka-1",
          category: "Zdraví"
        },
        {
          title: "BMR kalkulátor",
          description: "Bazální metabolismus",
          href: "/calculator/fitness-a-zdravi/kalkulacka-2",
          category: "Zdraví"
        },
        {
          title: "Procento z čísla",
          description: "Vypočítejte X% z daného čísla",
          href: "/calculator/procenta/procento-z-cisla",
          category: "Procenta"
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

export default IdealWeightCalculator;

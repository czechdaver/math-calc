"use client";

import React, { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Calculator, Settings, TrendingUp, BarChart3 } from "lucide-react";
import SimpleCalculatorLayout from "@/components/layout/SimpleCalculatorLayout";
import { 
  CalculatorInput,
  CalculatorSelect,
  CalculatorToggle,
  CalculatorRange,
  CalculatorResult,
  CalculatorChart,
  CalculatorDisclaimer
} from "@/components/calculators/shared";

/**
 * Complex Calculator Template Component
 * 
 * This template demonstrates advanced calculator patterns:
 * - Multi-step calculations with different input types
 * - Real-time chart visualization
 * - Complex state management
 * - Advanced validation patterns
 * - Multiple result displays
 * 
 * Use this template for calculators like:
 * - Compound Interest Calculator
 * - Loan Amortization Calculator
 * - Investment Analysis Calculator
 * - Net Salary Calculator with complex tax rules
 */
export default function ComplexCalculatorTemplate() {
  const t = useTranslations();

  // Complex state with multiple input types
  const [inputs, setInputs] = useState({
    principal: "100000",
    rate: "5",
    period: 10,
    frequency: "monthly",
    investmentType: "compound",
    riskLevel: 3
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Options for select components
  const frequencyOptions = [
    { value: "monthly", label: "Měsíční", description: "Složení úroků každý měsíc" },
    { value: "quarterly", label: "Čtvrtletní", description: "Složení úroků každé čtvrtletí" },
    { value: "yearly", label: "Roční", description: "Složení úroků jednou ročně" },
  ];

  const investmentTypeOptions = [
    { value: "compound", label: "Složené úročení", description: "Úroky se připočítávají k základu" },
    { value: "simple", label: "Jednoduché úročení", description: "Úroky se nepřipočítávají k základu" },
  ];

  // Complex validation
  const validateInputs = () => {
    const newErrors: Record<string, string> = {};
    
    const principal = parseFloat(inputs.principal.replace(/\s/g, "").replace(",", "."));
    const rate = parseFloat(inputs.rate.replace(",", "."));
    
    if (!inputs.principal || isNaN(principal) || principal <= 0) {
      newErrors.principal = "Zadejte platnou částku větší než 0";
    } else if (principal > 10000000) {
      newErrors.principal = "Maximální částka je 10 000 000 Kč";
    }
    
    if (!inputs.rate || isNaN(rate) || rate < 0 || rate > 50) {
      newErrors.rate = "Zadejte úrokovou sazbu mezi 0% a 50%";
    }
    
    if (inputs.period < 1 || inputs.period > 50) {
      newErrors.period = "Doba investice musí být mezi 1 a 50 lety";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Complex calculation with multiple results
  const calculation = useMemo(() => {
    if (!validateInputs()) return null;
    
    try {
      const principal = parseFloat(inputs.principal.replace(/\s/g, "").replace(",", "."));
      const annualRate = parseFloat(inputs.rate.replace(",", ".")) / 100;
      const years = inputs.period;
      
      // Calculate frequency multiplier
      const frequencies = {
        monthly: 12,
        quarterly: 4,
        yearly: 1
      };
      const frequency = frequencies[inputs.frequency as keyof typeof frequencies];
      
      let finalAmount: number;
      let totalInterest: number;
      let yearlyData: { label: string; value: number }[] = [];
      
      if (inputs.investmentType === "compound") {
        // Compound interest calculation
        const rate = annualRate / frequency;
        const periods = years * frequency;
        finalAmount = principal * Math.pow(1 + rate, periods);
        
        // Generate yearly data for chart
        for (let year = 1; year <= years; year++) {
          const amount = principal * Math.pow(1 + rate, year * frequency);
          yearlyData.push({
            label: `Rok ${year}`,
            value: Math.round(amount)
          });
        }
      } else {
        // Simple interest calculation
        finalAmount = principal * (1 + annualRate * years);
        
        // Generate yearly data for chart
        for (let year = 1; year <= years; year++) {
          const amount = principal * (1 + annualRate * year);
          yearlyData.push({
            label: `Rok ${year}`,
            value: Math.round(amount)
          });
        }
      }
      
      totalInterest = finalAmount - principal;
      
      // Risk adjustment based on risk level
      const riskMultipliers = [0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3];
      const adjustedFinalAmount = finalAmount * riskMultipliers[inputs.riskLevel - 1];
      const adjustedInterest = adjustedFinalAmount - principal;
      
      return {
        principal,
        finalAmount: Math.round(finalAmount),
        adjustedFinalAmount: Math.round(adjustedFinalAmount),
        totalInterest: Math.round(totalInterest),
        adjustedInterest: Math.round(adjustedInterest),
        yearlyData,
        effectiveRate: ((finalAmount / principal) ** (1 / years) - 1) * 100,
        monthlyContribution: totalInterest / (years * 12),
        isValid: true
      };
    } catch (error) {
      console.error("Calculation error:", error);
      return null;
    }
  }, [inputs]);

  const handleInputChange = (field: string, value: string | number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <SimpleCalculatorLayout
      title={t("calculators.<slug>.title") || "Pokročilý investiční kalkulátor"}
      description={t("calculators.<slug>.description") || "Komplexní kalkulátor pro investiční plánování s grafickou vizualizací"}
      category="finance"
      calculatorId="<slug>"
      enhanced={true}
      seo={{
        title: t("calculators.<slug>.seo.title") || "Investiční kalkulátor s grafem | MathCalc",
        description: t("calculators.<slug>.seo.description") || "Pokročilý kalkulátor pro výpočet zhodnocení investic se složeným úročením",
        keywords: (t("calculators.<slug>.seo.keywords") || "investice,složené úročení,kalkulátor,graf").split(",").map((s: string) => s.trim()),
      }}
      formula={{
        latex: inputs.investmentType === "compound" 
          ? "A = P(1 + \\frac{r}{n})^{nt}" 
          : "A = P(1 + rt)",
        description: inputs.investmentType === "compound"
          ? "Složené úročení: A = konečná částka, P = počáteční kapitál, r = roční úroková sazba, n = počet složení za rok, t = doba v letech"
          : "Jednoduché úročení: A = konečná částka, P = počáteční kapitál, r = roční úroková sazba, t = doba v letech",
      }}
      resultSection={calculation && (
        <div className="space-y-6">
          <CalculatorResult
            title="Výsledky investice"
            value={calculation.adjustedFinalAmount.toLocaleString('cs-CZ')}
            description="Očekávaná konečná hodnota s rizikovým faktorem"
            formula={`${calculation.principal.toLocaleString('cs-CZ')} → ${calculation.adjustedFinalAmount.toLocaleString('cs-CZ')} Kč`}
            additionalInfo={
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="enhanced-result-grid blue">
                    <div className="font-bold text-blue-600">{calculation.principal.toLocaleString('cs-CZ')} Kč</div>
                    <div className="text-xs text-gray-700">Počáteční kapitál</div>
                  </div>
                  <div className="enhanced-result-grid green">
                    <div className="font-bold text-green-600">{calculation.adjustedInterest.toLocaleString('cs-CZ')} Kč</div>
                    <div className="text-xs text-gray-700">Zisk (s rizikem)</div>
                  </div>
                  <div className="enhanced-result-grid violet">
                    <div className="font-bold text-violet-600">{calculation.effectiveRate.toFixed(2)}%</div>
                    <div className="text-xs text-gray-700">Efektivní sazba</div>
                  </div>
                  <div className="enhanced-result-grid amber">
                    <div className="font-bold text-amber-600">{calculation.monthlyContribution.toLocaleString('cs-CZ', { maximumFractionDigits: 0 })} Kč</div>
                    <div className="text-xs text-gray-700">Měsíční úrok</div>
                  </div>
                </div>
              </div>
            }
          />
          
          {calculation.yearlyData.length > 0 && (
            <CalculatorChart
              data={calculation.yearlyData}
              type="line"
              title="Vývoj investice v čase"
              height={300}
              color="blue"
              showValues={false}
              showLegend={false}
            />
          )}
        </div>
      )}
      examples={{
        title: "Příklady investičních strategií",
        description: "Různé scénáře pro investiční plánování",
        scenarios: [
          {
            title: "Konzervativní strategie",
            description: "Nízké riziko, stabilní výnosy",
            example: "100 000 Kč při 3% ročně po 10 let = 134 392 Kč"
          },
          {
            title: "Agresivní strategie", 
            description: "Vysoké riziko, potenciálně vysoké výnosy",
            example: "100 000 Kč při 8% ročně po 10 let = 215 892 Kč"
          }
        ],
      }}
      faq={[
        { 
          question: "Co znamená složené úročení?", 
          answer: "Složené úročení znamená, že úroky získané v předchozích obdobích se přidávají k původnímu kapitálu a v dalších obdobích také úročí." 
        },
        { 
          question: "Jak funguje rizikový faktor?", 
          answer: "Rizikový faktor upravuje očekávané výnosy podle volatility investice. Vyšší riziko může znamenat vyšší i nižší výnosy." 
        }
      ]}
      relatedCalculators={[]}
    >
      <div className="space-y-8">
        {/* Basic Investment Parameters */}
        <div className="enhanced-section">
          <div className="enhanced-section-header">
            <Calculator className="w-5 h-5" />
            Základní parametry investice
          </div>
          
          <div className="calc-form-grid calc-form-grid-2">
            <CalculatorInput
              id="principal"
              label="Počáteční kapitál"
              value={inputs.principal}
              onChange={(value) => handleInputChange("principal", value)}
              placeholder="100000"
              step="1000"
              unit="Kč"
              helpText="Částka, kterou chcete investovat"
              error={errors.principal}
              labelIcon={TrendingUp}
              color="blue"
              quickAdjustSteps={[10000, 50000, 100000]}
            />
            
            <CalculatorInput
              id="rate"
              label="Roční úroková sazba"
              value={inputs.rate}
              onChange={(value) => handleInputChange("rate", value)}
              placeholder="5"
              step="0.1"
              min="0"
              max="50"
              unit="%"
              helpText="Očekávaný roční výnos v procentech"
              error={errors.rate}
              labelIcon={BarChart3}
              color="green"
              quickAdjustSteps={[1, 2.5, 5]}
            />
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="enhanced-section">
          <div className="enhanced-section-header">
            <Settings className="w-5 h-5" />
            Pokročilé nastavení
          </div>
          
          <div className="space-y-6">
            <CalculatorRange
              id="period"
              label="Doba investice"
              value={inputs.period}
              onChange={(value) => handleInputChange("period", value)}
              min={1}
              max={50}
              unit="let"
              helpText="Jak dlouho plánujete investovat"
              color="violet"
              formatValue={(value) => value.toString()}
            />
            
            <CalculatorSelect
              id="frequency"
              label="Frekvence složení úroků"
              value={inputs.frequency}
              onChange={(value) => handleInputChange("frequency", value)}
              options={frequencyOptions}
              helpText="Jak často se úroky připočítávají k základu"
              labelIcon={Calculator}
              color="indigo"
            />
            
            <CalculatorToggle
              name="investment-type"
              label="Typ úročení"
              value={inputs.investmentType}
              onChange={(value) => handleInputChange("investmentType", value)}
              options={investmentTypeOptions}
              helpText="Způsob výpočtu úroků"
              color="amber"
              layout="vertical"
            />
            
            <CalculatorRange
              id="risk-level"
              label="Úroveň rizika"
              value={inputs.riskLevel}
              onChange={(value) => handleInputChange("riskLevel", value)}
              min={1}
              max={7}
              helpText="1 = velmi konzervativní, 7 = velmi agresivní"
              color="red"
              formatValue={(value) => {
                const levels = ["", "Velmi nízké", "Nízké", "Mírné", "Střední", "Vysoké", "Velmi vysoké", "Extrémní"];
                return levels[value];
              }}
            />
          </div>
        </div>

        <CalculatorDisclaimer type="legal" title="Důležité upozornění">
          Tento kalkulátor poskytuje pouze orientační výpočty. Skutečné výnosy investic mohou být výrazně odlišné
          v závislosti na tržních podmínkách, inflaci a dalších faktorech. Vždy konzultujte své investiční rozhodnutí
          s kvalifikovaným finančním poradcem.
        </CalculatorDisclaimer>
      </div>
    </SimpleCalculatorLayout>
  );
}
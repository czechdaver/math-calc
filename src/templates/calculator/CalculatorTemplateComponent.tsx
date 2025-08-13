"use client";

import React, { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Calculator, Plus } from "lucide-react";
import SimpleCalculatorLayout from "@/components/layout/SimpleCalculatorLayout";
import { 
  CalculatorInput,
  CalculatorResult,
  CalculatorDisclaimer
} from "@/components/calculators/shared";

/**
 * Enhanced Calculator Template Component
 * 
 * This template demonstrates best practices using the MathCalc Pro design system:
 * - Enhanced UI components with color theming
 * - Real-time calculation with validation  
 * - Proper error handling and user feedback
 * - Professional result display
 * - Accessibility compliance
 * 
 * To use this template:
 * 1. Copy this file to src/components/calculators/<Name>Calculator.tsx
 * 2. Replace all <slug> placeholders with your calculator slug
 * 3. Replace all <Name> placeholders with your calculator name
 * 4. Update the calculation logic in the calculateResult function
 * 5. Add proper i18n keys to cs.json and en.json
 * 6. Create the page wrapper using page.template.tsx
 */
export default function CalculatorTemplateComponent() {
  const t = useTranslations();

  // Enhanced state management with validation
  const [inputs, setInputs] = useState({
    a: "10",
    b: "5"
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation function
  const validateInputs = () => {
    const newErrors: Record<string, string> = {};
    
    const a = parseFloat(inputs.a.replace(",", "."));
    const b = parseFloat(inputs.b.replace(",", "."));
    
    if (!inputs.a || isNaN(a)) {
      newErrors.a = t("calculators.<slug>.validation.a_required") || "Zadejte platnou hodnotu A";
    }
    if (!inputs.b || isNaN(b)) {
      newErrors.b = t("calculators.<slug>.validation.b_required") || "Zadejte platnou hodnotu B";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enhanced calculation with error handling
  const result = useMemo(() => {
    if (!validateInputs()) return null;
    
    try {
      const a = parseFloat(inputs.a.replace(",", "."));
      const b = parseFloat(inputs.b.replace(",", "."));
      
      if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
      
      // Example calculation - replace with your logic
      const sum = a + b;
      const difference = a - b;
      const product = a * b;
      const quotient = b !== 0 ? a / b : null;
      
      return {
        sum,
        difference,
        product,
        quotient,
        isValid: true
      };
    } catch (error) {
      console.error("Calculation error:", error);
      return null;
    }
  }, [inputs]);

  // Input change handler with validation
  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <SimpleCalculatorLayout
      title={t("calculators.<slug>.title") || "Příklad kalkulátoru"}
      description={t("calculators.<slug>.description") || "Demonstrační kalkulátor s pokročilým designem"}
      category="mathematics"
      calculatorId="<slug>"
      enhanced={true}
      seo={{
        title: t("calculators.<slug>.seo.title") || "Příklad kalkulátoru | MathCalc",
        description: t("calculators.<slug>.seo.description") || "Bezplatný příklad kalkulátoru s pokročilými funkcemi",
        keywords: (t("calculators.<slug>.seo.keywords") || "kalkulátor,matematika,příklad").split(",").map((s: string) => s.trim()),
      }}
      formula={{
        latex: t("calculators.<slug>.formula.latex") || "A + B = C",
        description: t("calculators.<slug>.formula.description") || "Součet dvou čísel A a B",
      }}
      resultSection={result && (
        <CalculatorResult
          title={t("calculators.<slug>.result.title") || "Výsledky"}
          value={result.sum.toLocaleString('cs-CZ', { maximumFractionDigits: 2 })}
          description={t("calculators.<slug>.result.description") || "Součet zadaných hodnot"}
          formula={`${inputs.a} + ${inputs.b} = ${result.sum.toLocaleString('cs-CZ', { maximumFractionDigits: 2 })}`}
          additionalInfo={
            <div className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="enhanced-result-grid blue">
                  <div className="font-bold text-blue-600">{result.sum.toLocaleString('cs-CZ', { maximumFractionDigits: 2 })}</div>
                  <div className="text-xs text-gray-700">Součet</div>
                </div>
                <div className="enhanced-result-grid green">
                  <div className="font-bold text-green-600">{result.difference.toLocaleString('cs-CZ', { maximumFractionDigits: 2 })}</div>
                  <div className="text-xs text-gray-700">Rozdíl</div>
                </div>
                <div className="enhanced-result-grid violet">
                  <div className="font-bold text-violet-600">{result.product.toLocaleString('cs-CZ', { maximumFractionDigits: 2 })}</div>
                  <div className="text-xs text-gray-700">Součin</div>
                </div>
                <div className="enhanced-result-grid amber">
                  <div className="font-bold text-amber-600">
                    {result.quotient ? result.quotient.toLocaleString('cs-CZ', { maximumFractionDigits: 2 }) : "N/A"}
                  </div>
                  <div className="text-xs text-gray-700">Podíl</div>
                </div>
              </div>
            </div>
          }
        />
      )}
      examples={{
        title: t("calculators.<slug>.examples.title") || "Příklady použití",
        description: t("calculators.<slug>.examples.description") || "Praktické příklady výpočtů",
        scenarios: [
          {
            title: t("calculators.<slug>.examples.s1.title") || "Základní sčítání",
            description: t("calculators.<slug>.examples.s1.description") || "Sečtení dvou kladných čísel",
            example: "10 + 5 = 15"
          },
          {
            title: t("calculators.<slug>.examples.s2.title") || "Práce se zápornými čísly",
            description: t("calculators.<slug>.examples.s2.description") || "Výpočet s negativními hodnotami",
            example: "-3 + 7 = 4"
          }
        ],
      }}
      faq={[
        { 
          question: t("calculators.<slug>.faq.q1.q") || "Jak kalkulátor funguje?", 
          answer: t("calculators.<slug>.faq.q1.a") || "Kalkulátor provádí základní matematické operace v reálném čase." 
        },
        { 
          question: t("calculators.<slug>.faq.q2.q") || "Jaké formáty čísel jsou podporovány?", 
          answer: t("calculators.<slug>.faq.q2.a") || "Podporujeme desetinná čísla s tečkou nebo čárkou jako oddělovačem." 
        }
      ]}
      relatedCalculators={[]}
    >
      <div className="space-y-6">
        {/* Enhanced input components using the design system */}
        <div className="calc-form-grid calc-form-grid-2">
          <CalculatorInput
            id="value-a"
            label={t("calculators.<slug>.fields.a") || "Hodnota A"}
            value={inputs.a}
            onChange={(value) => handleInputChange("a", value)}
            placeholder="10"
            step="0.01"
            helpText={t("calculators.<slug>.help.a") || "Zadejte první číslo pro výpočet"}
            error={errors.a}
            labelIcon={Calculator}
            color="blue"
          />
          
          <CalculatorInput
            id="value-b"
            label={t("calculators.<slug>.fields.b") || "Hodnota B"}
            value={inputs.b}
            onChange={(value) => handleInputChange("b", value)}
            placeholder="5"
            step="0.01"
            helpText={t("calculators.<slug>.help.b") || "Zadejte druhé číslo pro výpočet"}
            error={errors.b}
            labelIcon={Plus}
            color="green"
          />
        </div>

        {/* Example disclaimer */}
        <CalculatorDisclaimer type="info" title="Informace o kalkulátoru">
          Tento kalkulátor slouží pouze pro demonstrační účely. Výsledky jsou zobrazovány v reálném čase 
          při zadávání hodnot. Pro přesné výpočty si vždy ověřte výsledky nezávislým způsobem.
        </CalculatorDisclaimer>
      </div>
    </SimpleCalculatorLayout>
  );
}

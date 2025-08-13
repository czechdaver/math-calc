'use client';

import React, { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Calculator, Banknote, User, Building, Receipt, TrendingDown } from 'lucide-react';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { 
  CalculatorInput,
  CalculatorSelect,
  CalculatorToggle,
  CalculatorRange,
  CalculatorResult,
  CalculatorChart,
  CalculatorDisclaimer
} from '@/components/calculators/shared';

/**
 * Enhanced Net Salary Calculator Prototype
 * 
 * This prototype demonstrates:
 * - Complex multi-step calculations with tax brackets
 * - Sectioned form layouts for different input categories
 * - Advanced validation patterns with dependent fields
 * - Professional chart visualization of deductions
 * - Complex business rules for social insurance
 * 
 * Pattern: Complex multi-step calculation with sectioned inputs
 * Template: Perfect for complex financial calculators
 */

type TaxResidency = 'resident' | 'non-resident';
type EmploymentType = 'employee' | 'agreement' | 'freelance';

interface SalaryBreakdown {
  grossSalary: number;
  socialInsuranceEmployee: number;
  socialInsuranceEmployer: number;
  healthInsuranceEmployee: number;
  healthInsuranceEmployer: number;
  incomeTax: number;
  netSalary: number;
  totalEmployerCost: number;
  effectiveTaxRate: number;
  isValid: boolean;
}

export default function EnhancedNetSalaryCalculator() {
  const t = useTranslations();

  // Complex state management for multi-section form
  const [inputs, setInputs] = useState({
    grossSalary: '35000',
    taxResidency: 'resident' as TaxResidency,
    employmentType: 'employee' as EmploymentType,
    children: 0,
    studentDeduction: false,
    disabilityDeduction: false,
    pensionContribution: '0',
    lifeInsurance: '0'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Tax residency options
  const residencyOptions = [
    { 
      value: 'resident', 
      label: 'Daňový rezident ČR', 
      description: 'Standardní daňové sazby a slevy' 
    },
    { 
      value: 'non-resident', 
      label: 'Daňový nerezident', 
      description: 'Vyšší daňové sazby, omezené slevy' 
    }
  ];

  // Employment type options
  const employmentOptions = [
    { 
      value: 'employee', 
      label: 'Zaměstnanec',
      description: 'Hlavní pracovní poměr s plným pojištěním'
    },
    { 
      value: 'agreement', 
      label: 'Dohoda o provedení práce',
      description: 'Limitované pojištění do 10 000 Kč/měsíc'
    },
    { 
      value: 'freelance', 
      label: 'OSVČ',
      description: 'Podnikatel - vlastní výpočet pojištění'
    }
  ];

  // Tax residency toggle options
  const residencyToggleOptions = [
    {
      value: 'resident',
      label: 'Daňový rezident',
      description: 'Bydlíte v ČR více než 183 dní v roce'
    },
    {
      value: 'non-resident', 
      label: 'Daňový nerezident',
      description: 'Pracujete v ČR, ale bydlíte v zahraničí'
    }
  ];

  // Czech tax rates and constants (2024)
  const TAX_CONSTANTS = {
    // Social insurance rates
    socialInsuranceEmployee: 0.065, // 6.5%
    socialInsuranceEmployer: 0.248, // 24.8%
    
    // Health insurance rates  
    healthInsuranceEmployee: 0.045, // 4.5%
    healthInsuranceEmployer: 0.09,  // 9%
    
    // Income tax
    incomeTaxRate: 0.15, // 15%
    superGrossSalaryMultiplier: 1.338, // 133.8% for tax calculation
    
    // Tax credits (monthly)
    basicTaxCredit: 2570,
    childTaxCredit: 1267,
    studentTaxCredit: 335,
    disabilityTaxCredit: 210,
    
    // Minimums
    minimumWage: 18900,
    
    // Agreement work limits
    agreementSocialLimit: 10000,
    agreementHealthLimit: 10000
  };

  // Enhanced validation with complex business rules
  const validateInputs = () => {
    const newErrors: Record<string, string> = {};
    
    const grossSalary = parseFloat(inputs.grossSalary.replace(/\s/g, '').replace(',', '.'));
    const pensionContribution = parseFloat(inputs.pensionContribution.replace(/\s/g, '').replace(',', '.'));
    const lifeInsurance = parseFloat(inputs.lifeInsurance.replace(/\s/g, '').replace(',', '.'));
    
    // Gross salary validation
    if (!inputs.grossSalary || isNaN(grossSalary)) {
      newErrors.grossSalary = 'Zadejte platnou hrubou mzdu';
    } else if (grossSalary < 1000) {
      newErrors.grossSalary = 'Minimální mzda je 1 000 Kč';
    } else if (grossSalary > 1000000) {
      newErrors.grossSalary = 'Maximální mzda je 1 000 000 Kč';
    }
    
    // Pension contribution validation
    if (inputs.pensionContribution && !isNaN(pensionContribution)) {
      if (pensionContribution < 0) {
        newErrors.pensionContribution = 'Příspěvek nemůže být záporný';
      } else if (pensionContribution > grossSalary * 0.1) {
        newErrors.pensionContribution = 'Maximální příspěvek je 10% hrubé mzdy';
      }
    }
    
    // Life insurance validation
    if (inputs.lifeInsurance && !isNaN(lifeInsurance)) {
      if (lifeInsurance < 0) {
        newErrors.lifeInsurance = 'Pojistné nemůže být záporné';
      } else if (lifeInsurance > 5000) {
        newErrors.lifeInsurance = 'Maximální daňově uznatelné pojistné je 5 000 Kč/měsíc';
      }
    }
    
    // Children validation
    if (inputs.children < 0 || inputs.children > 10) {
      newErrors.children = 'Počet dětí musí být mezi 0 a 10';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Complex salary calculation with all deductions and tax rules
  const calculation = useMemo(() => {
    if (!validateInputs()) return null;
    
    try {
      const grossSalary = parseFloat(inputs.grossSalary.replace(/\s/g, '').replace(',', '.'));
      const pensionContribution = parseFloat(inputs.pensionContribution.replace(/\s/g, '').replace(',', '.')) || 0;
      const lifeInsurance = parseFloat(inputs.lifeInsurance.replace(/\s/g, '').replace(',', '.')) || 0;
      
      // Social insurance calculation
      let socialInsuranceEmployee = 0;
      let socialInsuranceEmployer = 0;
      let healthInsuranceEmployee = 0; 
      let healthInsuranceEmployer = 0;
      
      if (inputs.employmentType === 'employee') {
        // Full employee rates
        socialInsuranceEmployee = grossSalary * TAX_CONSTANTS.socialInsuranceEmployee;
        socialInsuranceEmployer = grossSalary * TAX_CONSTANTS.socialInsuranceEmployer;
        healthInsuranceEmployee = grossSalary * TAX_CONSTANTS.healthInsuranceEmployee;
        healthInsuranceEmployer = grossSalary * TAX_CONSTANTS.healthInsuranceEmployer;
      } else if (inputs.employmentType === 'agreement') {
        // Agreement work - limited insurance if over thresholds
        if (grossSalary > TAX_CONSTANTS.agreementSocialLimit) {
          socialInsuranceEmployee = grossSalary * TAX_CONSTANTS.socialInsuranceEmployee;
          socialInsuranceEmployer = grossSalary * TAX_CONSTANTS.socialInsuranceEmployer;
        }
        if (grossSalary > TAX_CONSTANTS.agreementHealthLimit) {
          healthInsuranceEmployee = grossSalary * TAX_CONSTANTS.healthInsuranceEmployee;
          healthInsuranceEmployer = grossSalary * TAX_CONSTANTS.healthInsuranceEmployer;
        }
      } else {
        // Freelance - different calculation (simplified here)
        socialInsuranceEmployee = Math.min(grossSalary * 0.295, 50000); // Simplified
        healthInsuranceEmployee = Math.min(grossSalary * 0.135, 20000); // Simplified
      }
      
      // Tax base calculation
      const superGrossSalary = grossSalary * TAX_CONSTANTS.superGrossSalaryMultiplier;
      const taxBase = superGrossSalary - pensionContribution - lifeInsurance;
      
      // Income tax before credits
      let incomeTaxBeforeCredits = taxBase * TAX_CONSTANTS.incomeTaxRate;
      
      // Tax credits calculation
      let taxCredits = 0;
      
      if (inputs.taxResidency === 'resident') {
        // Basic tax credit
        taxCredits += TAX_CONSTANTS.basicTaxCredit;
        
        // Child tax credits
        taxCredits += inputs.children * TAX_CONSTANTS.childTaxCredit;
        
        // Student deduction
        if (inputs.studentDeduction) {
          taxCredits += TAX_CONSTANTS.studentTaxCredit;
        }
        
        // Disability deduction
        if (inputs.disabilityDeduction) {
          taxCredits += TAX_CONSTANTS.disabilityTaxCredit;
        }
      } else {
        // Non-residents get limited credits
        taxCredits += TAX_CONSTANTS.basicTaxCredit * 0.5; // 50% of basic credit
      }
      
      // Final income tax (cannot be negative)
      const incomeTax = Math.max(0, incomeTaxBeforeCredits - taxCredits);
      
      // Net salary calculation
      const totalDeductions = socialInsuranceEmployee + healthInsuranceEmployee + incomeTax;
      const netSalary = grossSalary - totalDeductions;
      
      // Total employer cost
      const totalEmployerCost = grossSalary + socialInsuranceEmployer + healthInsuranceEmployer;
      
      // Effective tax rate
      const effectiveTaxRate = (totalDeductions / grossSalary) * 100;
      
      return {
        grossSalary: Math.round(grossSalary * 100) / 100,
        socialInsuranceEmployee: Math.round(socialInsuranceEmployee * 100) / 100,
        socialInsuranceEmployer: Math.round(socialInsuranceEmployer * 100) / 100,
        healthInsuranceEmployee: Math.round(healthInsuranceEmployee * 100) / 100,
        healthInsuranceEmployer: Math.round(healthInsuranceEmployer * 100) / 100,
        incomeTax: Math.round(incomeTax * 100) / 100,
        netSalary: Math.round(netSalary * 100) / 100,
        totalEmployerCost: Math.round(totalEmployerCost * 100) / 100,
        effectiveTaxRate: Math.round(effectiveTaxRate * 100) / 100,
        isValid: true
      };
    } catch (error) {
      console.error('Net salary calculation error:', error);
      return null;
    }
  }, [inputs]);

  // Chart data for visualizing deductions
  const chartData = useMemo(() => {
    if (!calculation) return [];
    
    return [
      {
        label: 'Čistá mzda',
        value: calculation.netSalary,
        color: '#10b981' // green
      },
      {
        label: 'Sociální pojištění',
        value: calculation.socialInsuranceEmployee,
        color: '#3b82f6' // blue
      },
      {
        label: 'Zdravotní pojištění',
        value: calculation.healthInsuranceEmployee,
        color: '#8b5cf6' // violet
      },
      {
        label: 'Daň z příjmu',
        value: calculation.incomeTax,
        color: '#f59e0b' // amber
      }
    ];
  }, [calculation]);

  // Input change handlers
  const handleInputChange = (field: string, value: string | number | boolean) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <SimpleCalculatorLayout
      title="Kalkulátor čisté mzdy"
      description="Pokročilý kalkulátor pro výpočet čisté mzdy včetně všech odvodů, daní a slev. Podporuje různé typy zaměstnání a daňového statusu."
      category="finance"
      calculatorId="net-salary"
      enhanced={true}
      seo={{
        title: 'Kalkulátor čisté mzdy 2024 | Výpočet mzdy po odvodech',
        description: 'Přesný výpočet čisté mzdy v ČR. Zahrnuje sociální a zdravotní pojištění, daň z příjmu, slevy na děti a další odpočty pro rok 2024.',
        keywords: [
          'kalkulátor čisté mzdy',
          'výpočet mzdy',
          'daň z příjmu',
          'sociální pojištění',
          'zdravotní pojištění',
          'mzda 2024'
        ]
      }}
      formula={{
        latex: '\\text{Čistá mzda} = \\text{Hrubá mzda} - \\text{SP} - \\text{ZP} - \\text{Daň}',
        description: 'Čistá mzda = Hrubá mzda - Sociální pojištění (6,5%) - Zdravotní pojištění (4,5%) - Daň z příjmu (15% ze superhrubé mzdy) + Slevy'
      }}
      resultSection={calculation && (
        <div className="space-y-6">
          <CalculatorResult
            title="Rozpis mzdy"
            value={`${calculation.netSalary.toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kč`}
            description="Čistá mzda po všech odvodech a daních"
            formula={`${calculation.grossSalary.toLocaleString('cs-CZ')} Kč - ${(calculation.socialInsuranceEmployee + calculation.healthInsuranceEmployee + calculation.incomeTax).toLocaleString('cs-CZ')} Kč = ${calculation.netSalary.toLocaleString('cs-CZ')} Kč`}
            additionalInfo={
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="enhanced-result-grid blue">
                    <div className="font-bold text-blue-600">
                      {calculation.grossSalary.toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kč
                    </div>
                    <div className="text-xs text-gray-700">Hrubá mzda</div>
                  </div>
                  <div className="enhanced-result-grid red">
                    <div className="font-bold text-red-600">
                      {(calculation.socialInsuranceEmployee + calculation.healthInsuranceEmployee + calculation.incomeTax).toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kč
                    </div>
                    <div className="text-xs text-gray-700">Celkové odvody</div>
                  </div>
                  <div className="enhanced-result-grid green">
                    <div className="font-bold text-green-600">
                      {calculation.netSalary.toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kč
                    </div>
                    <div className="text-xs text-gray-700">Čistá mzda</div>
                  </div>
                  <div className="enhanced-result-grid amber">
                    <div className="font-bold text-amber-600">
                      {calculation.effectiveTaxRate.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-700">Efektivní sazba</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Odvody zaměstnance:</h4>
                    <div className="space-y-1 text-gray-600">
                      <div className="flex justify-between">
                        <span>Sociální pojištění (6,5%):</span>
                        <span>{calculation.socialInsuranceEmployee.toLocaleString('cs-CZ')} Kč</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Zdravotní pojištění (4,5%):</span>
                        <span>{calculation.healthInsuranceEmployee.toLocaleString('cs-CZ')} Kč</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Daň z příjmu (15%):</span>
                        <span>{calculation.incomeTax.toLocaleString('cs-CZ')} Kč</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Náklady zaměstnavatele:</h4>
                    <div className="space-y-1 text-gray-600">
                      <div className="flex justify-between">
                        <span>Hrubá mzda:</span>
                        <span>{calculation.grossSalary.toLocaleString('cs-CZ')} Kč</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sociální pojištění (24,8%):</span>
                        <span>{calculation.socialInsuranceEmployer.toLocaleString('cs-CZ')} Kč</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Zdravotní pojištění (9%):</span>
                        <span>{calculation.healthInsuranceEmployer.toLocaleString('cs-CZ')} Kč</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Celkové náklady:</span>
                        <span>{calculation.totalEmployerCost.toLocaleString('cs-CZ')} Kč</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          />
          
          {chartData.length > 0 && (
            <CalculatorChart
              data={chartData}
              type="pie"
              title="Rozdělení hrubé mzdy"
              height={300}
              color="blue"
              showValues={true}
              showLegend={true}
            />
          )}
        </div>
      )}
      examples={{
        title: 'Praktické příklady',
        description: 'Typické situace při výpočtu čisté mzdy',
        scenarios: [
          {
            title: 'Průměrná mzda v ČR',
            description: 'Výpočet čisté mzdy z průměrné hrubé mzdy',
            example: '40 000 Kč hrubého → cca 30 800 Kč čistého'
          },
          {
            title: 'Minimální mzda',
            description: 'Nejnižší možná mzda v ČR',
            example: '18 900 Kč hrubého → cca 16 200 Kč čistého'
          },
          {
            title: 'Vyšší příjmy',
            description: 'Efekt progresivního zdanění u vyšších mezd',
            example: '80 000 Kč hrubého → cca 58 400 Kč čistého'
          }
        ]
      }}
      faq={[
        {
          question: 'Jak se počítá superhrubá mzda?',
          answer: 'Superhrubá mzda = hrubá mzda × 1,338 (133,8%). Z této částky se počítá daň z příjmu před slevami.'
        },
        {
          question: 'Jaké slevy na dani mohu uplatnit?',
          answer: 'Základní sleva 30 840 Kč/rok, sleva na dítě 15 204 Kč/rok, sleva pro studenty 4 020 Kč/rok a další podle situace.'
        },
        {
          question: 'Liší se výpočet pro dohody o provedení práce?',
          answer: 'Ano, u dohod se platí pojištění až od určité částky (10 000 Kč/měsíc) a daň se počítá jinak.'
        },
        {
          question: 'Co je efektivní daňová sazba?',
          answer: 'Poměr všech odvodů (pojištění + daň) k hrubé mzdě vyjádřený v procentech. Ukazuje skutečnou daňovou zátěž.'
        }
      ]}
      relatedCalculators={[
        {
          title: 'DPH Kalkulátor',
          description: 'Výpočet daně z přidané hodnoty',
          href: '/calculator/vat-enhanced',
          category: 'finance'
        },
        {
          title: 'Kalkulátor procent',
          description: 'Obecný kalkulátor procentuálních výpočtů',
          href: '/calculator/procenta',
          category: 'mathematics'
        }
      ]}
    >
      <div className="space-y-8">
        {/* Basic Salary Information */}
        <div className="enhanced-section">
          <div className="enhanced-section-header">
            <Banknote className="w-5 h-5" />
            Základní údaje o mzdě
          </div>
          
          <div className="space-y-6">
            <CalculatorInput
              id="grossSalary"
              label="Hrubá mzda"
              value={inputs.grossSalary}
              onChange={(value) => handleInputChange('grossSalary', value)}
              placeholder="35000"
              step="100"
              min="1000"
              unit="Kč/měsíc"
              helpText="Zadejte hrubou mzdu před všemi odvody"
              error={errors.grossSalary}
              labelIcon={Banknote}
              color="blue"
              quickAdjustSteps={[5000, 10000, 15000]}
            />
            
            <CalculatorToggle
              name="taxResidency"
              label="Daňové rezidentství"
              value={inputs.taxResidency}
              onChange={(value) => handleInputChange('taxResidency', value)}
              options={residencyToggleOptions}
              helpText="Ovlivňuje výši slev na dani"
              color="indigo"
              layout="vertical"
            />
            
            <CalculatorSelect
              id="employmentType"
              label="Typ zaměstnání"
              value={inputs.employmentType}
              onChange={(value) => handleInputChange('employmentType', value)}
              options={employmentOptions}
              helpText="Různé typy zaměstnání mají odlišné sazby pojištění"
              labelIcon={Building}
              color="violet"
            />
          </div>
        </div>

        {/* Tax Deductions and Credits */}
        <div className="enhanced-section">
          <div className="enhanced-section-header">
            <Receipt className="w-5 h-5" />
            Slevy a odpočty
          </div>
          
          <div className="space-y-6">
            <CalculatorRange
              id="children"
              label="Počet dětí"
              value={inputs.children}
              onChange={(value) => handleInputChange('children', value)}
              min={0}
              max={5}
              helpText="Děti do 26 let (studenti) nebo do 18 let"
              color="green"
              formatValue={(value) => `${value} ${value === 1 ? 'dítě' : value < 5 ? 'děti' : 'dětí'}`}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inputs.studentDeduction}
                    onChange={(e) => handleInputChange('studentDeduction', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Student do 26 let</span>
                </label>
                <p className="text-xs text-gray-500 ml-7">Sleva 4 020 Kč ročně</p>
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inputs.disabilityDeduction}
                    onChange={(e) => handleInputChange('disabilityDeduction', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Zdravotní postižení</span>
                </label>
                <p className="text-xs text-gray-500 ml-7">Sleva 2 520 Kč ročně</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CalculatorInput
                id="pensionContribution"
                label="Penzijní spoření"
                value={inputs.pensionContribution}
                onChange={(value) => handleInputChange('pensionContribution', value)}
                placeholder="0"
                step="100"
                min="0"
                unit="Kč/měsíc"
                helpText="Příspěvek do penzijního spoření (max 10% hrubé mzdy)"
                error={errors.pensionContribution}
                color="green"
              />
              
              <CalculatorInput
                id="lifeInsurance"
                label="Životní pojištění"
                value={inputs.lifeInsurance}
                onChange={(value) => handleInputChange('lifeInsurance', value)}
                placeholder="0"
                step="100"
                min="0"
                unit="Kč/měsíc"
                helpText="Pojistné na životní pojištění (max 5 000 Kč/měsíc)"
                error={errors.lifeInsurance}
                color="amber"
              />
            </div>
          </div>
        </div>

        {/* Information Disclaimers */}
        <CalculatorDisclaimer type="warning" title="Důležité upozornění">
          Kalkulátor používá sazby platné pro rok 2024. Výpočet je zjednodušený a nemusí 
          zahrnovat všechny specifické situace (např. různé typy příjmů, místní koeficienty apod.). 
          Pro přesný výpočet konzultujte s účetním nebo daňovým poradcem.
        </CalculatorDisclaimer>
        
        <CalculatorDisclaimer type="info" title="Informace o výpočtu">
          Výpočet zahrnuje: sociální pojištění (6,5% + 24,8%), zdravotní pojištění (4,5% + 9%), 
          daň z příjmu (15% ze superhrubé mzdy) a všechny běžné slevy na dani. 
          Nerezidenti mají omezenější slevy a mohou podléhat jiným sazbám.
        </CalculatorDisclaimer>
      </div>
    </SimpleCalculatorLayout>
  );
}
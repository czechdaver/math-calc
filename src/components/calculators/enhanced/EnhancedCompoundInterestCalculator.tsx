'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { Calculator, TrendingUp, DollarSign, Calendar, Target, BarChart3 } from 'lucide-react';
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
 * Enhanced Compound Interest Calculator Prototype
 * 
 * This prototype demonstrates:
 * - Chart visualization with time-series data for investment growth
 * - Advanced mathematical calculations with compound interest formulas
 * - Interactive scenarios with different parameters
 * - Investment analysis patterns with multiple result metrics
 * 
 * Pattern: Chart visualization with time-series data
 * Template: Perfect for investment/growth calculators
 */

type CompoundingFrequency = 'daily' | 'monthly' | 'quarterly' | 'semi-annually' | 'annually';
type ContributionFrequency = 'monthly' | 'quarterly' | 'annually';

export default function EnhancedCompoundInterestCalculator() {
  // Complex state for investment calculator
  const [inputs, setInputs] = useState({
    initialAmount: '100000',
    monthlyContribution: '5000',
    interestRate: '7',
    years: 10,
    compoundingFrequency: 'monthly' as CompoundingFrequency,
    contributionFrequency: 'monthly' as ContributionFrequency,
    inflationRate: '3',
    includeInflation: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Compounding frequency options
  const compoundingOptions = [
    { 
      value: 'daily', 
      label: 'Denně', 
      description: '365× ročně - maximální složení' 
    },
    { 
      value: 'monthly', 
      label: 'Měsíčně', 
      description: '12× ročně - standardní pro banky' 
    },
    { 
      value: 'quarterly', 
      label: 'Čtvrtletně', 
      description: '4× ročně - typické pro obligace' 
    },
    { 
      value: 'semi-annually', 
      label: 'Pololetně', 
      description: '2× ročně - některé investice' 
    },
    { 
      value: 'annually', 
      label: 'Ročně', 
      description: '1× ročně - jednoduché složení' 
    }
  ];

  // Contribution frequency options
  const contributionFrequencyOptions = [
    {
      value: 'monthly',
      label: 'Měsíční příspěvky',
      description: 'Pravidelné měsíční investování'
    },
    {
      value: 'quarterly', 
      label: 'Čtvrtletní příspěvky',
      description: 'Investování každé 3 měsíce'
    },
    {
      value: 'annually',
      label: 'Roční příspěvky', 
      description: 'Jednou ročně na začátku roku'
    }
  ];

  // Get compounding periods per year
  const getCompoundingPeriods = (frequency: CompoundingFrequency): number => {
    const periods = {
      daily: 365,
      monthly: 12,
      quarterly: 4,
      'semi-annually': 2,
      annually: 1
    };
    return periods[frequency];
  };

  // Get contribution periods per year
  const getContributionPeriods = (frequency: ContributionFrequency): number => {
    const periods = {
      monthly: 12,
      quarterly: 4,
      annually: 1
    };
    return periods[frequency];
  };

  // Enhanced validation for investment inputs
  const validateInputs = useCallback(() => {
    const newErrors: Record<string, string> = {};
    
    const initialAmount = parseFloat(inputs.initialAmount.replace(/\s/g, '').replace(',', '.'));
    const monthlyContribution = parseFloat(inputs.monthlyContribution.replace(/\s/g, '').replace(',', '.'));
    const interestRate = parseFloat(inputs.interestRate.replace(',', '.'));
    const inflationRate = parseFloat(inputs.inflationRate.replace(',', '.'));
    
    // Initial amount validation
    if (!inputs.initialAmount || isNaN(initialAmount)) {
      newErrors.initialAmount = 'Zadejte platnou počáteční částku';
    } else if (initialAmount < 0) {
      newErrors.initialAmount = 'Počáteční částka nemůže být záporná';
    } else if (initialAmount > 100000000) {
      newErrors.initialAmount = 'Maximální částka je 100 000 000 Kč';
    }
    
    // Monthly contribution validation
    if (!inputs.monthlyContribution || isNaN(monthlyContribution)) {
      newErrors.monthlyContribution = 'Zadejte platný měsíční příspěvek';
    } else if (monthlyContribution < 0) {
      newErrors.monthlyContribution = 'Měsíční příspěvek nemůže být záporný';
    } else if (monthlyContribution > 1000000) {
      newErrors.monthlyContribution = 'Maximální měsíční příspěvek je 1 000 000 Kč';
    }
    
    // Interest rate validation
    if (!inputs.interestRate || isNaN(interestRate)) {
      newErrors.interestRate = 'Zadejte platnou úrokovou sazbu';
    } else if (interestRate < 0) {
      newErrors.interestRate = 'Úroková sazba nemůže být záporná';
    } else if (interestRate > 50) {
      newErrors.interestRate = 'Maximální úroková sazba je 50%';
    }
    
    // Years validation
    if (inputs.years < 1 || inputs.years > 50) {
      newErrors.years = 'Doba investice musí být mezi 1 a 50 lety';
    }
    
    // Inflation rate validation (if enabled)
    if (inputs.includeInflation) {
      if (!inputs.inflationRate || isNaN(inflationRate)) {
        newErrors.inflationRate = 'Zadejte platnou míru inflace';
      } else if (inflationRate < 0 || inflationRate > 20) {
        newErrors.inflationRate = 'Míra inflace musí být mezi 0% a 20%';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [inputs]);

  // Complex compound interest calculation with detailed yearly breakdown
  const calculation = useMemo(() => {
    if (!validateInputs()) return null;
    
    try {
      const principal = parseFloat(inputs.initialAmount.replace(/\s/g, '').replace(',', '.'));
      const monthlyContrib = parseFloat(inputs.monthlyContribution.replace(/\s/g, '').replace(',', '.'));
      const annualRate = parseFloat(inputs.interestRate.replace(',', '.')) / 100;
      const years = inputs.years;
      const inflationRate = inputs.includeInflation ? parseFloat(inputs.inflationRate.replace(',', '.')) / 100 : 0;
      
      const compoundingPeriodsPerYear = getCompoundingPeriods(inputs.compoundingFrequency);
      const contributionPeriodsPerYear = getContributionPeriods(inputs.contributionFrequency);
      
      // Calculate contribution amount per period
      const contributionPerPeriod = monthlyContrib * (12 / compoundingPeriodsPerYear);
      
      // Periodic rate
      const periodicRate = annualRate / compoundingPeriodsPerYear;
      
      const yearlyData: Array<{
        year: number;
        principal: number;
        contributions: number;
        interest: number;
        total: number;
      }> = [];
      
      let currentPrincipal = principal;
      let totalContributions = principal;
      let totalInterest = 0;
      
      // Calculate year by year
      for (let year = 1; year <= years; year++) {
        const yearStartAmount = currentPrincipal;
        let yearContributions = 0;
        let yearInterest = 0;
        
        // Calculate each compounding period in the year
        for (let period = 0; period < compoundingPeriodsPerYear; period++) {
          // Add interest
          const periodInterest = currentPrincipal * periodicRate;
          currentPrincipal += periodInterest;
          yearInterest += periodInterest;
          totalInterest += periodInterest;
          
          // Add contribution if it's time (based on contribution frequency)
          const isContributionPeriod = contributionPeriodsPerYear === 1 
            ? period === 0 // Annual: at the beginning of year
            : contributionPeriodsPerYear === 4 
              ? period % 3 === 0 // Quarterly: every 3 months
              : period % 1 === 0; // Monthly: every month
          
          if (isContributionPeriod && contributionPerPeriod > 0) {
            currentPrincipal += contributionPerPeriod;
            yearContributions += contributionPerPeriod;
            totalContributions += contributionPerPeriod;
          }
        }
        
        yearlyData.push({
          year,
          principal: Math.round(yearStartAmount),
          contributions: Math.round(yearContributions),
          interest: Math.round(yearInterest),
          total: Math.round(currentPrincipal)
        });
      }
      
      const finalAmount = currentPrincipal;
      
      // Calculate effective annual rate
      const effectiveAnnualRate = Math.pow(1 + periodicRate, compoundingPeriodsPerYear) - 1;
      
      // Inflation-adjusted values
      const realFinalAmount = inputs.includeInflation 
        ? finalAmount / Math.pow(1 + inflationRate, years)
        : finalAmount;
      
      return {
        finalAmount: Math.round(finalAmount),
        totalContributions: Math.round(totalContributions),
        totalInterest: Math.round(totalInterest),
        initialInvestment: Math.round(principal),
        yearlyData,
        monthlyContribution: monthlyContrib,
        effectiveAnnualRate: effectiveAnnualRate * 100,
        realFinalAmount: Math.round(realFinalAmount),
        inflationImpact: Math.round(finalAmount - realFinalAmount),
        isValid: true
      };
    } catch (error) {
      console.error('Compound interest calculation error:', error);
      return null;
    }
  }, [inputs, validateInputs]);

  // Chart data for investment growth visualization
  const chartData = useMemo(() => {
    if (!calculation) return [];
    
    return calculation.yearlyData.map(yearData => ({
      label: `Rok ${yearData.year}`,
      value: yearData.total,
      description: `Celkem: ${yearData.total.toLocaleString('cs-CZ')} Kč`
    }));
  }, [calculation]);

  // Breakdown chart data for final amount composition
  const breakdownChartData = useMemo(() => {
    if (!calculation) return [];
    
    return [
      {
        label: 'Počáteční investice',
        value: calculation.initialInvestment,
        color: '#3b82f6' // blue
      },
      {
        label: 'Celkové příspěvky',
        value: calculation.totalContributions - calculation.initialInvestment,
        color: '#10b981' // green
      },
      {
        label: 'Zisk z úroků',
        value: calculation.totalInterest,
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
      title="Kalkulátor složeného úročení"
      description="Pokročilý kalkulátor pro výpočet zhodnocení investic se složeným úročením. Vizualizace růstu investice v čase s různými frekvencemi složení."
      category="finance"
      calculatorId="compound-interest"
      enhanced={true}
      seo={{
        title: 'Kalkulátor složeného úročení | Výpočet zhodnocení investic',
        description: 'Profesionální kalkulátor složeného úročení s grafickou vizualizací. Výpočet budoucí hodnoty investice s pravidelným investováním.',
        keywords: [
          'složené úročení',
          'kalkulátor investic',
          'zhodnocení investice',
          'compound interest',
          'investiční kalkulátor',
          'pravidelné investování'
        ]
      }}
      formula={{
        latex: 'A = P(1 + \\frac{r}{n})^{nt} + PMT \\times \\frac{(1 + \\frac{r}{n})^{nt} - 1}{\\frac{r}{n}}',
        description: 'A = konečná částka, P = počáteční kapitál, r = roční úroková sazba, n = počet složení za rok, t = doba v letech, PMT = pravidelný příspěvek'
      }}
      resultSection={calculation && (
        <div className="space-y-6">
          <CalculatorResult
            title="Výsledky investice"
            value={`${calculation.finalAmount.toLocaleString('cs-CZ', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} Kč`}
            description="Celková hodnota investice po uvedené době"
            formula={`${calculation.totalContributions.toLocaleString('cs-CZ')} Kč + ${calculation.totalInterest.toLocaleString('cs-CZ')} Kč = ${calculation.finalAmount.toLocaleString('cs-CZ')} Kč`}
            additionalInfo={
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="enhanced-result-grid blue">
                    <div className="font-bold text-blue-600">
                      {calculation.initialInvestment.toLocaleString('cs-CZ')} Kč
                    </div>
                    <div className="text-xs text-gray-700">Počáteční investice</div>
                  </div>
                  <div className="enhanced-result-grid green">
                    <div className="font-bold text-green-600">
                      {(calculation.totalContributions - calculation.initialInvestment).toLocaleString('cs-CZ')} Kč
                    </div>
                    <div className="text-xs text-gray-700">Celkové příspěvky</div>
                  </div>
                  <div className="enhanced-result-grid amber">
                    <div className="font-bold text-amber-600">
                      {calculation.totalInterest.toLocaleString('cs-CZ')} Kč
                    </div>
                    <div className="text-xs text-gray-700">Zisk z úroků</div>
                  </div>
                  <div className="enhanced-result-grid violet">
                    <div className="font-bold text-violet-600">
                      {calculation.effectiveAnnualRate.toFixed(2)}%
                    </div>
                    <div className="text-xs text-gray-700">Efektivní sazba</div>
                  </div>
                </div>
                
                {inputs.includeInflation && calculation.realFinalAmount && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-medium text-yellow-800 mb-2">Vliv inflace:</h4>
                    <div className="text-sm text-yellow-700 space-y-1">
                      <div className="flex justify-between">
                        <span>Nominální hodnota:</span>
                        <span className="font-medium">{calculation.finalAmount.toLocaleString('cs-CZ')} Kč</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Reálná hodnota (po inflaci):</span>
                        <span className="font-medium">{calculation.realFinalAmount.toLocaleString('cs-CZ')} Kč</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ztráta inflací:</span>
                        <span className="font-medium">{calculation.inflationImpact?.toLocaleString('cs-CZ')} Kč</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex justify-between">
                    <span>Zhodnocení:</span>
                    <span className="font-medium">
                      {((calculation.finalAmount / calculation.totalContributions - 1) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Poměr zisku k příspěvkům:</span>
                    <span className="font-medium">
                      {(calculation.totalInterest / (calculation.totalContributions - calculation.initialInvestment) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            }
          />
          
          {chartData.length > 0 && (
            <CalculatorChart
              data={chartData}
              type="line"
              title="Růst investice v čase"
              height={350}
              color="blue"
              showValues={false}
              showLegend={false}
            />
          )}
          
          {breakdownChartData.length > 0 && (
            <CalculatorChart
              data={breakdownChartData}
              type="pie"
              title="Složení konečné částky"
              height={300}
              color="green"
              showValues={true}
              showLegend={true}
            />
          )}
        </div>
      )}
      examples={{
        title: 'Investiční scénáře',
        description: 'Praktické příklady dlouhodobého investování',
        scenarios: [
          {
            title: 'Konzervativní investor',
            description: 'Nízké riziko, stabilní výnosy',
            example: '100 000 Kč + 5 000 Kč/měsíc při 4% ročně po 20 let = 2 290 000 Kč'
          },
          {
            title: 'Vyvážený investor', 
            description: 'Střední riziko a výnosy',
            example: '100 000 Kč + 5 000 Kč/měsíc při 7% ročně po 20 let = 2 890 000 Kč'
          },
          {
            title: 'Agresivní investor',
            description: 'Vysoké riziko, vysoké výnosy',
            example: '100 000 Kč + 5 000 Kč/měsíc při 10% ročně po 20 let = 3 680 000 Kč'
          }
        ]
      }}
      faq={[
        {
          question: 'Co je složené úročení?',
          answer: 'Složené úročení znamená, že úroky získané v předchozích obdobích se přidávají k původnímu kapitálu a v dalších obdobích také úročí. Je to "úrok z úroku".'
        },
        {
          question: 'Jak často se úročí mé investice?',
          answer: 'Závisí na typu investice. Bankovní vklady obvykle měsíčně, obligace čtvrtletně nebo pololetně, akciové fondy obvykle ročně při reinvestici dividend.'
        },
        {
          question: 'Proč je pravidelné investování výhodné?',
          answer: 'Pravidelné investování (DCA - Dollar Cost Averaging) snižuje vliv volatility trhu a umožňuje využít sílu složeného úročení na maximum.'
        },
        {
          question: 'Jak velký vliv má inflace?',
          answer: 'Inflace snižuje reálnou kupní sílu peněz. Proto je důležité investovat do nástrojů, které inflaci alespoň vyrovnají nebo překonají.'
        }
      ]}
      relatedCalculators={[
        {
          title: 'Kalkulátor čisté mzdy',
          description: 'Výpočet disponibilních prostředků pro investování',
          href: '/calculator/net-salary-enhanced',
          category: 'finance'
        },
        {
          title: 'DPH Kalkulátor', 
          description: 'Výpočet daní při prodeji investic',
          href: '/calculator/vat-enhanced',
          category: 'finance'
        }
      ]}
    >
      <div className="space-y-8">
        {/* Investment Parameters */}
        <div className="enhanced-section">
          <div className="enhanced-section-header">
            <DollarSign className="w-5 h-5" />
            Parametry investice
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CalculatorInput
                id="initialAmount"
                label="Počáteční investice"
                value={inputs.initialAmount}
                onChange={(value) => handleInputChange('initialAmount', value)}
                placeholder="100000"
                step="10000"
                min="0"
                unit="Kč"
                helpText="Jednorázová částka na začátku investování"
                error={errors.initialAmount}
                labelIcon={Target}
                color="blue"
                quickAdjustSteps={[50000, 100000, 200000]}
              />
              
              <CalculatorInput
                id="monthlyContribution"
                label="Měsíční příspěvek"
                value={inputs.monthlyContribution}
                onChange={(value) => handleInputChange('monthlyContribution', value)}
                placeholder="5000"
                step="1000"
                min="0"
                unit="Kč/měsíc"
                helpText="Pravidelný měsíční příspěvek do investice"
                error={errors.monthlyContribution}
                labelIcon={Calendar}
                color="green"
                quickAdjustSteps={[2000, 5000, 10000]}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CalculatorInput
                id="interestRate"
                label="Roční výnosnost"
                value={inputs.interestRate}
                onChange={(value) => handleInputChange('interestRate', value)}
                placeholder="7"
                step="0.5"
                min="0"
                max="50"
                unit="%"
                helpText="Očekávaná průměrná roční výnosnost"
                error={errors.interestRate}
                labelIcon={TrendingUp}
                color="amber"
                quickAdjustSteps={[3, 5, 7]}
              />
              
              <CalculatorRange
                id="years"
                label="Doba investice"
                value={inputs.years}
                onChange={(value) => handleInputChange('years', value)}
                min={1}
                max={50}
                unit="let"
                helpText="Jak dlouho budete investovat"
                color="violet"
                formatValue={(value) => `${value} ${value === 1 ? 'rok' : value < 5 ? 'roky' : 'let'}`}
              />
            </div>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="enhanced-section">
          <div className="enhanced-section-header">
            <BarChart3 className="w-5 h-5" />
            Pokročilé nastavení
          </div>
          
          <div className="space-y-6">
            <CalculatorSelect
              id="compoundingFrequency"
              label="Frekvence složení úroků"
              value={inputs.compoundingFrequency}
              onChange={(value) => handleInputChange('compoundingFrequency', value)}
              options={compoundingOptions}
              helpText="Jak často se úroky připočítávají k základu"
              labelIcon={Calculator}
              color="indigo"
            />
            
            <CalculatorToggle
              name="contributionFrequency"
              label="Frekvence příspěvků"
              value={inputs.contributionFrequency}
              onChange={(value) => handleInputChange('contributionFrequency', value)}
              options={contributionFrequencyOptions}
              helpText="Jak často budete přispívat do investice"
              color="green"
              layout="vertical"
            />
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="includeInflation"
                  checked={inputs.includeInflation}
                  onChange={(e) => handleInputChange('includeInflation', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="includeInflation" className="text-sm font-medium text-gray-700">
                  Zohlednit vliv inflace
                </label>
              </div>
              
              {inputs.includeInflation && (
                <CalculatorInput
                  id="inflationRate"
                  label="Míra inflace"
                  value={inputs.inflationRate}
                  onChange={(value) => handleInputChange('inflationRate', value)}
                  placeholder="3"
                  step="0.1"
                  min="0"
                  max="20"
                  unit="%"
                  helpText="Očekávaná průměrná roční inflace"
                  error={errors.inflationRate}
                  color="red"
                />
              )}
            </div>
          </div>
        </div>

        {/* Information and Disclaimers */}
        <CalculatorDisclaimer type="info" title="Jak funguje složené úročení">
          Složené úročení je jeden z nejmocnějších nástrojů pro budování bohatství. Čím dříve začnete 
          investovat a čím déle necháte peníze růst, tím větší bude výsledný efekt. Einstein údajně 
          nazval složené úročení &quot;osmým divem světa&quot;.
        </CalculatorDisclaimer>
        
        <CalculatorDisclaimer type="warning" title="Důležité upozornění">
          Kalkulátor poskytuje pouze orientační výpočty založené na zadaných parametrech. 
          Skutečné výnosy investic se mohou výrazně lišit v závislosti na tržních podmínkách, 
          typu investice a dalších faktorech. Minulé výnosy nejsou zárukou budoucích výsledků.
        </CalculatorDisclaimer>
        
        <CalculatorDisclaimer type="help" title="Tipy pro úspěšné investování">
          <ul className="list-disc pl-5 space-y-1">
            <li>Začněte co nejdříve - čas je váš největší spojenec</li>
            <li>Investujte pravidelně bez ohledu na tržní podmínky (DCA)</li>
            <li>Diverzifikujte své portfolio mezi různé typy aktiv</li>
            <li>Reinvestujte všechny výnosy pro maximální efekt složeného úročení</li>
            <li>Mějte dlouhodobou perspektivu a nevzdávejte se při krátkodobých výkyvech</li>
          </ul>
        </CalculatorDisclaimer>
      </div>
    </SimpleCalculatorLayout>
  );
}
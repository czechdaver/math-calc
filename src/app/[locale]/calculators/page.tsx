import React from 'react';
import { useTranslations } from 'next-intl';
import { Metadata } from 'next';
import { Calculator, GitBranch, CheckCircle, Clock, AlertTriangle, Zap, Star, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'All Calculators Overview - Development Status',
  description: 'Complete overview of all calculator versions, development status, and testing URLs'
};

// Calculator data structure with all versions and their status
const calculatorData = [
  // BMI Calculators
  {
    name: 'BMI Calculator',
    category: 'Health',
    versions: [
      {
        name: 'Basic BMI',
        url: '/calculator/bmi',
        status: 'stable',
        hasEnhancedUI: false,
        refactored: true,
        features: ['Basic BMI calculation', 'WHO categories', 'Validation']
      },
      {
        name: 'Enhanced BMI',
        url: '/calculator/bmi-enhanced',
        status: 'stable',
        hasEnhancedUI: true,
        refactored: true,
        features: ['Modern UI', 'Interactive results', 'Examples', 'FAQ', 'Ads integration']
      },
      {
        name: 'BMI v2',
        url: '/calculator/bmi-v2',
        status: 'beta',
        hasEnhancedUI: true,
        refactored: true,
        features: ['Advanced UI', 'Charts', 'Detailed analysis']
      },
      {
        name: 'BMI v3',
        url: '/calculator/bmi-v3',
        status: 'beta',
        hasEnhancedUI: true,
        refactored: false,
        features: ['Latest UI patterns', 'Performance optimized']
      }
    ]
  },
  
  // VAT Calculators
  {
    name: 'VAT Calculator',
    category: 'Finance',
    versions: [
      {
        name: 'Basic VAT',
        url: '/calculator/vat',
        status: 'stable',
        hasEnhancedUI: false,
        refactored: true,
        features: ['Basic VAT calculation', 'Multiple rates', 'Bi-directional']
      },
      {
        name: 'Enhanced VAT',
        url: '/calculator/vat-enhanced',
        status: 'beta',
        hasEnhancedUI: true,
        refactored: true,
        features: ['Modern UI', 'Visual breakdowns', 'Country-specific rates']
      }
    ]
  },

  // Net Salary Calculators
  {
    name: 'Net Salary Calculator',
    category: 'Finance',
    versions: [
      {
        name: 'Basic Net Salary',
        url: '/calculator/net-salary',
        status: 'stable',
        hasEnhancedUI: false,
        refactored: true,
        features: ['Basic salary calculation', 'Tax deductions', 'Social insurance']
      },
      {
        name: 'Enhanced Net Salary',
        url: '/calculator/net-salary-enhanced',
        status: 'beta',
        hasEnhancedUI: true,
        refactored: true,
        features: ['Advanced UI', 'Breakdown charts', 'Multiple scenarios']
      }
    ]
  },

  // Compound Interest
  {
    name: 'Compound Interest Calculator',
    category: 'Finance',
    versions: [
      {
        name: 'Basic Compound Interest',
        url: '/calculator/finance/compound-interest',
        status: 'stable',
        hasEnhancedUI: false,
        refactored: true,
        features: ['Interest calculation', 'Time periods', 'Growth visualization']
      },
      {
        name: 'Enhanced Compound Interest',
        url: '/calculator/compound-interest-enhanced',
        status: 'beta',
        hasEnhancedUI: true,
        refactored: true,
        features: ['Interactive charts', 'Scenario comparison', 'Export options']
      }
    ]
  },

  // Unit Converter
  {
    name: 'Unit Converter',
    category: 'Conversion',
    versions: [
      {
        name: 'Basic Unit Converter',
        url: '/calculator/unit-converter',
        status: 'stable',
        hasEnhancedUI: false,
        refactored: true,
        features: ['Length/Weight/Volume/Temperature', 'Multiple units', 'Formulas']
      },
      {
        name: 'Enhanced Unit Converter',
        url: '/components/calculators/enhanced/EnhancedUnitConverterCalculator',
        status: 'development',
        hasEnhancedUI: true,
        refactored: false,
        features: ['Modern UI', 'Quick conversions', 'Favorites', 'History']
      }
    ]
  },

  // Percentage Calculators
  {
    name: 'Percentage Calculators',
    category: 'Math',
    versions: [
      {
        name: 'Percentage of Number',
        url: '/calculator/percentages/percentage-of',
        status: 'stable',
        hasEnhancedUI: false,
        refactored: true,
        features: ['X% of Y calculation', 'Step-by-step', 'Examples']
      },
      {
        name: 'What Percentage',
        url: '/calculator/percentages/what-percent',
        status: 'stable',
        hasEnhancedUI: false,
        refactored: true,
        features: ['X is what % of Y', 'Reverse calculation', 'Practical examples']
      },
      {
        name: 'X is What Percent',
        url: '/calculator/percentages/x-is-what-percent',
        status: 'stable',
        hasEnhancedUI: false,
        refactored: true,
        features: ['Y is X%, what is 100%', 'Base calculation', 'Business scenarios']
      }
    ]
  },

  // Rule of Three
  {
    name: 'Rule of Three',
    category: 'Math',
    versions: [
      {
        name: 'Direct Proportion',
        url: '/calculator/rule-of-three/direct',
        status: 'stable',
        hasEnhancedUI: false,
        refactored: true,
        features: ['Direct proportions', 'Formula visualization', 'Real-world examples']
      },
      {
        name: 'Inverse Proportion',
        url: '/calculator/rule-of-three/inverse',
        status: 'stable',
        hasEnhancedUI: false,
        refactored: true,
        features: ['Inverse proportions', 'Mathematical explanations', 'Practice problems']
      }
    ]
  },

  // Finance Calculators
  {
    name: 'Advanced Finance',
    category: 'Finance',
    versions: [
      {
        name: 'Annuity Calculator',
        url: '/calculator/finance/annuity',
        status: 'stable',
        hasEnhancedUI: false,
        refactored: true,
        features: ['Payment calculations', 'Present/Future value', 'Amortization']
      },
      {
        name: 'Early Repayment',
        url: '/calculator/finance/early-repayment',
        status: 'stable',
        hasEnhancedUI: false,
        refactored: true,
        features: ['Loan repayment optimization', 'Interest savings', 'Scenarios']
      },
      {
        name: 'ROI Calculator',
        url: '/calculator/finance/roi',
        status: 'stable',
        hasEnhancedUI: false,
        refactored: true,
        features: ['Return on Investment', 'Annualized ROI', 'Comparison tools']
      },
      {
        name: 'NPV Calculator',
        url: '/calculator/finance/npv',
        status: 'stable',
        hasEnhancedUI: false,
        refactored: true,
        features: ['Net Present Value', 'Cash flow analysis', 'Profitability index']
      },
      {
        name: 'IRR Calculator',
        url: '/calculator/finance/irr',
        status: 'stable',
        hasEnhancedUI: false,
        refactored: true,
        features: ['Internal Rate of Return', 'Investment analysis', 'Break-even']
      }
    ]
  },

  // Health Calculators
  {
    name: 'Health & Fitness',
    category: 'Health',
    versions: [
      {
        name: 'BMR Calculator',
        url: '/calculator/health/bmr',
        status: 'stable',
        hasEnhancedUI: false,
        refactored: true,
        features: ['Basal Metabolic Rate', 'Multiple formulas', 'Age/Gender factors']
      },
      {
        name: 'Calories Calculator',
        url: '/calculator/health/calories',
        status: 'stable',
        hasEnhancedUI: false,
        refactored: true,
        features: ['Daily calorie needs', 'Activity levels', 'Weight goals']
      },
      {
        name: 'Ideal Weight',
        url: '/calculator/health/ideal-weight',
        status: 'stable',
        hasEnhancedUI: false,
        refactored: true,
        features: ['Multiple formulas', 'Body frame types', 'Recommendations']
      },
      {
        name: 'Body Fat Calculator',
        url: '/calculator/health/body-fat',
        status: 'stable',
        hasEnhancedUI: false,
        refactored: true,
        features: ['Multiple measurement methods', 'Accuracy comparison', 'Health ranges']
      },
      {
        name: 'Age Calculator',
        url: '/calculator/health/age',
        status: 'stable',
        hasEnhancedUI: false,
        refactored: true,
        features: ['Precise age calculation', 'Life statistics', 'Zodiac signs']
      },
      {
        name: 'Tip Calculator',
        url: '/calculator/health/tip',
        status: 'stable',
        hasEnhancedUI: false,
        refactored: true,
        features: ['Service quality levels', 'Bill splitting', 'Custom percentages']
      }
    ]
  },

  // Practical Calculators
  {
    name: 'Practical Tools',
    category: 'Practical',
    versions: [
      {
        name: 'Discount Calculator',
        url: '/calculator/practical/discount',
        status: 'stable',
        hasEnhancedUI: false,
        refactored: true,
        features: ['Multiple discount types', 'Savings analysis', 'Shopping optimization']
      },
      {
        name: 'Fuel Calculator',
        url: '/calculator/practical/fuel',
        status: 'stable',
        hasEnhancedUI: false,
        refactored: true,
        features: ['Consumption calculation', 'Trip costs', 'Efficiency tips']
      },
      {
        name: 'Time Calculator',
        url: '/calculator/practical/time',
        status: 'stable',
        hasEnhancedUI: false,
        refactored: true,
        features: ['Time arithmetic', 'Work hours', 'Duration calculations']
      },
      {
        name: 'Currency Calculator',
        url: '/calculator/practical/currency',
        status: 'stable',
        hasEnhancedUI: false,
        refactored: true,
        features: ['Multi-currency', 'Exchange rates', 'Popular conversions']
      },
      {
        name: 'Loan Calculator',
        url: '/calculator/practical/loan',
        status: 'stable',
        hasEnhancedUI: false,
        refactored: true,
        features: ['Loan payments', 'Interest calculations', 'Amortization tables']
      },
      {
        name: 'Material Calculator',
        url: '/calculator/practical/material',
        status: 'stable',
        hasEnhancedUI: false,
        refactored: true,
        features: ['Construction materials', 'Waste calculations', 'Cost estimation']
      }
    ]
  },

  // Construction Calculators
  {
    name: 'Construction Tools',
    category: 'Construction',
    versions: [
      {
        name: 'Concrete Calculator',
        url: '/calculator/construction/concrete',
        status: 'stable',
        hasEnhancedUI: false,
        refactored: true,
        features: ['Volume calculations', 'Mix ratios', 'Material requirements']
      },
      {
        name: 'Insulation Calculator',
        url: '/calculator/construction/insulation',
        status: 'stable',
        hasEnhancedUI: false,
        refactored: true,
        features: ['Thermal calculations', 'R-values', 'Energy savings']
      },
      {
        name: 'Materials Calculator',
        url: '/calculator/construction/materials',
        status: 'stable',
        hasEnhancedUI: false,
        refactored: true,
        features: ['Multiple materials', 'Quantity estimation', 'Cost planning']
      },
      {
        name: 'Volume Calculator',
        url: '/calculator/construction/volume',
        status: 'stable',
        hasEnhancedUI: false,
        refactored: true,
        features: ['3D shapes', 'Complex volumes', 'Unit conversions']
      },
      {
        name: 'Area Calculator',
        url: '/calculator/construction/area',
        status: 'stable',
        hasEnhancedUI: false,
        refactored: true,
        features: ['2D shapes', 'Complex areas', 'Surface calculations']
      }
    ]
  },

  // Other Tools
  {
    name: 'Mathematical Tools',
    category: 'Math',
    versions: [
      {
        name: 'Fractions Calculator',
        url: '/calculator/fractions',
        status: 'stable',
        hasEnhancedUI: false,
        refactored: true,
        features: ['All operations', 'Simplification', 'Mixed numbers', 'Decimals']
      }
    ]
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'stable': return 'bg-green-100 text-green-800 border-green-200';
    case 'beta': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'development': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'deprecated': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'stable': return <CheckCircle className="w-4 h-4" />;
    case 'beta': return <Clock className="w-4 h-4" />;
    case 'development': return <AlertTriangle className="w-4 h-4" />;
    default: return <Clock className="w-4 h-4" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Health': return 'bg-pink-100 text-pink-800';
    case 'Finance': return 'bg-green-100 text-green-800';
    case 'Math': return 'bg-purple-100 text-purple-800';
    case 'Practical': return 'bg-blue-100 text-blue-800';
    case 'Construction': return 'bg-orange-100 text-orange-800';
    case 'Conversion': return 'bg-indigo-100 text-indigo-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function CalculatorsOverviewPage() {
  const t = useTranslations();
  
  const totalCalculators = calculatorData.reduce((total, calc) => total + calc.versions.length, 0);
  const stableCalculators = calculatorData.reduce((total, calc) => 
    total + calc.versions.filter(v => v.status === 'stable').length, 0);
  const enhancedCalculators = calculatorData.reduce((total, calc) => 
    total + calc.versions.filter(v => v.hasEnhancedUI).length, 0);
  const refactoredCalculators = calculatorData.reduce((total, calc) => 
    total + calc.versions.filter(v => v.refactored).length, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Calculator className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            All Calculators Overview
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Complete development status and testing URLs for all calculator versions
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{totalCalculators}</div>
            <div className="text-sm text-gray-600">Total Calculators</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stableCalculators}</div>
            <div className="text-sm text-gray-600">Stable</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{enhancedCalculators}</div>
            <div className="text-sm text-gray-600">Enhanced UI</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{refactoredCalculators}</div>
            <div className="text-sm text-gray-600">Refactored</div>
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Status Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm">Stable - Production ready</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm">Beta - Testing phase</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm">Development - Work in progress</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-600" />
              <span className="text-sm">Enhanced UI - Modern design</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calculators Table */}
      <div className="space-y-6">
        {calculatorData.map((calculator, idx) => (
          <Card key={idx}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{calculator.name}</CardTitle>
                <Badge className={getCategoryColor(calculator.category)}>
                  {calculator.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2">Version</th>
                      <th className="text-left py-2 px-2">Status</th>
                      <th className="text-left py-2 px-2">Enhanced UI</th>
                      <th className="text-left py-2 px-2">Refactored</th>
                      <th className="text-left py-2 px-2">Testing URL</th>
                      <th className="text-left py-2 px-2">Features</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculator.versions.map((version, vIdx) => (
                      <tr key={vIdx} className="border-b last:border-b-0">
                        <td className="py-3 px-2">
                          <div className="font-medium">{version.name}</div>
                        </td>
                        <td className="py-3 px-2">
                          <Badge className={`${getStatusColor(version.status)} flex items-center gap-1 w-fit`}>
                            {getStatusIcon(version.status)}
                            {version.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            {version.hasEnhancedUI ? (
                              <>
                                <Zap className="w-4 h-4 text-purple-600" />
                                <span className="text-green-600">Yes</span>
                              </>
                            ) : (
                              <span className="text-gray-400">No</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            {version.refactored ? (
                              <>
                                <GitBranch className="w-4 h-4 text-green-600" />
                                <span className="text-green-600">Yes</span>
                              </>
                            ) : (
                              <span className="text-gray-400">No</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="space-y-1">
                            <a 
                              href={`/cs${version.url}`}
                              className="block text-blue-600 hover:text-blue-800 text-sm"
                            >
                              🇨🇿 Czech
                            </a>
                            <a 
                              href={`/en${version.url}`}
                              className="block text-blue-600 hover:text-blue-800 text-sm"
                            >
                              🇬🇧 English
                            </a>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="text-sm text-gray-600">
                            <ul className="space-y-1">
                              {version.features.slice(0, 3).map((feature, fIdx) => (
                                <li key={fIdx}>• {feature}</li>
                              ))}
                              {version.features.length > 3 && (
                                <li className="text-gray-400">... +{version.features.length - 3} more</li>
                              )}
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Development Notes */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Development Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-green-600 mb-2">✅ Completed</h4>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• All basic calculators are stable and refactored</li>
              <li>• Enhanced UI components created for BMI, VAT, Net Salary, Compound Interest</li>
              <li>• Comprehensive testing and validation implemented</li>
              <li>• Internationalization (Czech/English) fully functional</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-blue-600 mb-2">🔄 In Progress</h4>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• Enhanced versions currently in beta testing</li>
              <li>• BMI v2 and v3 experimental versions</li>
              <li>• Enhanced Unit Converter in development</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-orange-600 mb-2">📋 Next Steps</h4>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• Promote stable enhanced versions to production</li>
              <li>• Complete Enhanced Unit Converter development</li>
              <li>• Add enhanced versions for remaining calculators</li>
              <li>• Implement advanced charting and analytics</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
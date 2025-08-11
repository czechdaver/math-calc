'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqItems: FAQItem[];
  className?: string;
  title?: string;
  hideHeader?: boolean;
  compact?: boolean; // match BMI v3 spacing
}

const FAQSection: React.FC<FAQSectionProps> = ({ 
  faqItems, 
  className = '',
  title,
  hideHeader = false,
  compact = false,
}) => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <Card className={className}>
      {!hideHeader && (
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <HelpCircle className="w-5 h-5 text-blue-600" />
            </div>
            {title ?? 'Frequently Asked Questions'}
          </CardTitle>
        </CardHeader>
      )}
      
      <CardContent className={compact ? 'py-5 space-y-2' : 'py-5 space-y-2'}>
        {faqItems.map((item, index) => (
          <div 
            key={index} 
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-shadow"
          >
            <button
              onClick={() => toggleItem(index)}
              className={compact 
                ? 'w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors group'
                : 'w-full px-4 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors group'}
            >
              <span className="font-medium text-gray-900 pr-4">
                {item.question}
              </span>
              <ChevronDown 
                className={`
                  w-5 h-5 text-gray-500 transition-transform duration-200 flex-shrink-0
                  group-hover:text-blue-600
                  ${openItems.includes(index) ? 'rotate-180' : ''}
                `} 
              />
            </button>
            
            {openItems.includes(index) && (
              <div className={compact ? 'px-4 pb-3 border-t border-gray-100 bg-gray-50' : 'px-4 pb-5 border-t border-gray-100 bg-gray-50'}>
                <div className={compact ? 'pt-3 text-gray-600 text-sm leading-relaxed' : 'pt-4 text-gray-600 text-sm leading-relaxed'}>
                  {item.answer}
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default FAQSection;
// src/components/shared/SimpleFAQ.tsx
import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SimpleFAQProps {
  faq: FAQItem[];
}

/**
 * SimpleFAQ component for displaying accordion-style FAQ sections.
 * Supports multiple open items and smooth toggle functionality.
 *
 * @param faq - Array of FAQ items with question and answer
 */
const SimpleFAQ: React.FC<SimpleFAQProps> = ({ faq }) => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="space-y-2">
      {faq.map((item, index) => (
        <div key={index} className="border border-border rounded-lg">
          <button
            onClick={() => toggleItem(index)}
            className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-muted transition-colors"
          >
            <span className="font-medium text-foreground">{item.question}</span>
            <ChevronRight
              className={`w-4 h-4 text-muted-foreground transition-transform ${
                openItems.includes(index) ? 'rotate-90' : ''
              }`}
            />
          </button>
          {openItems.includes(index) && (
            <div className="px-4 pb-3 text-muted-foreground text-sm border-t border-border">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SimpleFAQ;

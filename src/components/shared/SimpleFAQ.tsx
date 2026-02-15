import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Plus, Minus } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SimpleFAQProps {
  faq: FAQItem[];
  className?: string;
}

const FAQItemComponent = ({ item, isOpen, onClick }: { item: FAQItem; isOpen: boolean; onClick: () => void }) => {
  return (
    <motion.div
      initial={false}
      className={cn(
        "border rounded-xl overflow-hidden transition-all duration-300",
        isOpen
          ? "bg-white/60 dark:bg-slate-900/60 border-primary/20 shadow-lg shadow-primary/5"
          : "bg-white/40 dark:bg-slate-900/40 border-border/50 hover:bg-white/60 dark:hover:bg-slate-900/60 hover:border-primary/10"
      )}
    >
      <button
        onClick={onClick}
        className="flex items-center justify-between w-full p-5 text-left group"
      >
        <span className={cn(
          "text-base font-medium transition-colors duration-300",
          isOpen ? "text-primary" : "text-foreground group-hover:text-primary/90"
        )}>
          {item.question}
        </span>
        <div className={cn(
          "flex-shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
          isOpen
            ? "bg-primary text-primary-foreground rotate-90"
            : "bg-primary/10 text-primary group-hover:bg-primary/20"
        )}>
          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="px-5 pb-5 pt-0 text-muted-foreground leading-relaxed">
              <div className="pt-2 border-t border-dashed border-border/50">
                {item.answer}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const SimpleFAQ: React.FC<SimpleFAQProps> = ({ faq, className }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faq || faq.length === 0) return null;

  return (
    <div className={cn("space-y-4", className)}>
      {faq.map((item, index) => (
        <FAQItemComponent
          key={index}
          item={item}
          isOpen={openIndex === index}
          onClick={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </div>
  );
};

export default SimpleFAQ;

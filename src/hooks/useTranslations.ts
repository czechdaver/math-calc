// Simple translation stub to replace next-intl temporarily
export function useTranslations(namespace?: string) {
  // Return a function that just returns the key as fallback
  return (key: string, params?: any) => {
    // Simple fallback translations for common keys
    const translations: Record<string, string> = {
      'categories.percentages': 'Procenta',
      'categories.percentages_description': 'Kalkulátor procent',
      'categories.bmi': 'BMI Kalkulátor',
      'categories.bmi_description': 'Výpočet BMI indexu',
      'categories.vat': 'DPH Kalkulátor',
      'categories.vat_description': 'Výpočet DPH',
      'homepage.title': 'Matematické kalkulátory pro každodenní použití',
      'homepage.subtitle': 'Rychlé a přesné výpočty pro vaše potřeby',
      'homepage.cta_button': 'Začít počítat',
      'common.calculate': 'Vypočítat',
      'common.result': 'Výsledek',
      'common.height': 'Výška',
      'common.weight': 'Váha',
      'common.bmi': 'BMI',
      'common.category': 'Kategorie'
    };
    
    return translations[key] || key;
  };
}

// Export for compatibility
export default useTranslations;

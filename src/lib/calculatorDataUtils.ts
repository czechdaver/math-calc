// src/lib/calculatorDataUtils.ts
import calculatorsData from '@/data/calculators.json';
import relationshipsData from '@/data/calculator-relationships.json';
import categoriesData from '@/data/calculator-categories.json';

export interface Calculator {
  id: string;
  slug: string;
  category: string;
  popularity: number;
  titleKey: string;
  descriptionKey: string;
  path: string;
  tags: string[];
  relatedCategories: string[];
}

export interface RelatedCalculator {
  id: string;
  title: string;
  description: string;
  href: string;
  category: string;
}

export interface QuickLinkCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  calculators: Calculator[];
  count: number;
}

/**
 * Get calculator data by ID
 */
export function getCalculator(id: string): Calculator | null {
  const calc = calculatorsData.calculators[id as keyof typeof calculatorsData.calculators];
  return calc || null;
}

/**
 * Get related calculators for a given calculator ID
 */
export function getRelatedCalculators(
  calculatorId: string, 
  locale: string,
  t: (key: string) => string
): RelatedCalculator[] {
  const relationships = relationshipsData.relationships[calculatorId as keyof typeof relationshipsData.relationships];
  
  if (!relationships) {
    return getFallbackRelatedCalculators(calculatorId, locale, t);
  }

  const relatedCalcs: RelatedCalculator[] = [];
  
  // Get related calculators in priority order
  for (const relatedId of relationships.priorityOrder) {
    if (relatedCalcs.length >= relationships.maxCount) break;
    if (!relationships.related.includes(relatedId)) continue;
    
    const calc = getCalculator(relatedId);
    if (!calc) continue;
    
    relatedCalcs.push({
      id: calc.id,
      title: t(calc.titleKey),
      description: t(calc.descriptionKey),
      href: `/${locale}${calc.path}`,
      category: calc.category
    });
  }
  
  // Fill remaining slots with fallback if needed
  if (relatedCalcs.length < relationships.maxCount) {
    const fallbackCalcs = getFallbackRelatedCalculators(calculatorId, locale, t);
    const existingIds = new Set(relatedCalcs.map(c => c.id));
    
    for (const fallback of fallbackCalcs) {
      if (relatedCalcs.length >= relationships.maxCount) break;
      if (!existingIds.has(fallback.id)) {
        relatedCalcs.push(fallback);
      }
    }
  }
  
  return relatedCalcs;
}

/**
 * Get fallback related calculators (same category + popular)
 */
function getFallbackRelatedCalculators(
  calculatorId: string,
  locale: string, 
  t: (key: string) => string
): RelatedCalculator[] {
  const currentCalc = getCalculator(calculatorId);
  if (!currentCalc) return [];
  
  const { sameCategory, popularityThreshold, maxFallbackCount } = relationshipsData.fallbackStrategy;
  
  const allCalculators = Object.values(calculatorsData.calculators);
  const candidates = allCalculators
    .filter(calc => 
      calc.id !== calculatorId &&
      calc.popularity >= popularityThreshold &&
      (!sameCategory || calc.category === currentCalc.category)
    )
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, maxFallbackCount);
    
  return candidates.map(calc => ({
    id: calc.id,
    title: t(calc.titleKey),
    description: t(calc.descriptionKey), 
    href: `/${locale}${calc.path}`,
    category: calc.category
  }));
}

/**
 * Get calculator categories for quick links
 */
export function getCalculatorCategories(
  locale: string,
  t: (key: string) => string
): QuickLinkCategory[] {
  const categories = Object.values(categoriesData.categories)
    .sort((a, b) => a.priority - b.priority);
    
  return categories.map(category => {
    const calculators = category.calculators
      .map(id => getCalculator(id))
      .filter((calc): calc is Calculator => calc !== null);
      
    return {
      id: category.id,
      title: t(category.titleKey),
      description: t(category.descriptionKey),
      icon: category.icon,
      color: category.color,
      bgColor: category.bgColor,
      calculators,
      count: calculators.length
    };
  });
}

/**
 * Get quick links (popular, recent, etc.)
 */
export function getQuickLinks(
  type: 'popular' | 'recent',
  locale: string,
  t: (key: string) => string
): RelatedCalculator[] {
  const quickLink = categoriesData.quickLinks[type];
  if (!quickLink) return [];
  
  const calculators = quickLink.calculators
    .slice(0, quickLink.maxCount)
    .map(id => getCalculator(id))
    .filter((calc): calc is Calculator => calc !== null);
    
  return calculators.map(calc => ({
    id: calc.id,
    title: t(calc.titleKey),
    description: t(calc.descriptionKey),
    href: `/${locale}${calc.path}`,
    category: calc.category
  }));
}

/**
 * Search calculators by query
 */
export function searchCalculators(
  query: string,
  locale: string,
  t: (key: string) => string,
  limit: number = 5
): RelatedCalculator[] {
  const searchTerm = query.toLowerCase();
  const allCalculators = Object.values(calculatorsData.calculators);
  
  const matches = allCalculators
    .filter(calc => {
      const title = t(calc.titleKey).toLowerCase();
      const description = t(calc.descriptionKey).toLowerCase();
      const tags = calc.tags.join(' ').toLowerCase();
      
      return title.includes(searchTerm) || 
             description.includes(searchTerm) || 
             tags.includes(searchTerm);
    })
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
    
  return matches.map(calc => ({
    id: calc.id,
    title: t(calc.titleKey),
    description: t(calc.descriptionKey),
    href: `/${locale}${calc.path}`,
    category: calc.category
  }));
}

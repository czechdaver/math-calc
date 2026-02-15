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
  aliasKeys?: string[];
}

export interface RelatedCalculator {
  id: string;
  title: string;
  description: string;
  href: string;
  category: string;
  popularity: number;
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
  return (calc as Calculator) || null;
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
      category: calc.category,
      popularity: calc.popularity
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

  const allCalculators = Object.values(calculatorsData.calculators) as Calculator[];
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
    category: calc.category,
    popularity: calc.popularity
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
 * Get ALL calculators grouped by category + Others
 */
export function getAllCategoriesWithCalculators(
  locale: string,
  t: (key: string) => string
): QuickLinkCategory[] {
  // 1. Get standard categories with their calculators
  const standardCategories = getCalculatorCategories(locale, t);

  // 2. Identify all categorized calculator IDs
  const categorizedIds = new Set<string>();
  standardCategories.forEach(cat => {
    cat.calculators.forEach(c => categorizedIds.add(c.id));
  });

  // 3. Find uncategorized calculators
  const allCalculators = Object.values(calculatorsData.calculators) as Calculator[];
  const uncategorizedCalculators = allCalculators.filter(calc => !categorizedIds.has(calc.id));

  // 4. If any found, create a dynamic "Others" category
  if (uncategorizedCalculators.length > 0) {
    const othersCategory: QuickLinkCategory = {
      id: "others",
      title: t("common.other_categories"), // Or specific key if available
      description: "",
      icon: "HelpCircle", // Default icon
      color: "text-gray-500",
      bgColor: "bg-gray-100",
      calculators: uncategorizedCalculators,
      count: uncategorizedCalculators.length
    };
    return [...standardCategories, othersCategory];
  }

  return standardCategories;
}

/**
 * Get full category data by ID
 */
export function getCategoryById(
  categoryId: string,
  locale: string,
  t: (key: string) => string
): QuickLinkCategory | null {
  const category = categoriesData.categories[categoryId as keyof typeof categoriesData.categories];

  if (!category) return null;

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
    category: calc.category,
    popularity: calc.popularity
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
  if (!query || query.trim().length === 0) return [];

  const searchTerm = query.toLowerCase().trim();
  const allCalculators = Object.values(calculatorsData.calculators) as Calculator[];

  const matches = allCalculators
    .filter(calc => {
      const title = t(calc.titleKey).toLowerCase();
      const description = t(calc.descriptionKey).toLowerCase();
      const tags = calc.tags.join(' ').toLowerCase();

      // Check for alias keys if present
      let aliasMatch = false;
      if (calc.aliasKeys && calc.aliasKeys.length > 0) {
        aliasMatch = calc.aliasKeys.some(key => t(key).toLowerCase().includes(searchTerm));
      }

      return title.includes(searchTerm) ||
        description.includes(searchTerm) ||
        tags.includes(searchTerm) ||
        aliasMatch;
    })
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);

  return matches.map(calc => ({
    id: calc.id,
    title: t(calc.titleKey),
    description: t(calc.descriptionKey),
    href: `/${locale}${calc.path}`,
    category: calc.category,
    popularity: calc.popularity
  }));
}

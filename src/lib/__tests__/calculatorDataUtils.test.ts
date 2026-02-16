import { searchCalculators } from '../calculatorDataUtils';

// Mock translation function
const t = (key: string) => {
    const translations: Record<string, string> = {
        'bmi_calculator_title': 'Kalkulátor BMI',
        'bmi_calculator_description': 'Vypočítejte svůj Body Mass Index',
        'bmi_alias_full': 'index tělesné hmotnosti',
        'bmi_alias_weight': 'váha a výška',
        'percentage_calculator_title': 'Procenta',
        'percentage_calculator_description': 'Výpočet procent',
    };
    return translations[key] || key;
};

describe('searchCalculators', () => {
    it('should return empty array for empty query', () => {
        const results = searchCalculators('', 'cs', t);
        expect(results).toEqual([]);
    });

    it('should find calculator by title', () => {
        const results = searchCalculators('BMI', 'cs', t);
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].id).toBe('bmi');
    });

    it('should find calculator by alias', () => {
        const results = searchCalculators('index tělesné', 'cs', t);
        const bmiResult = results.find(r => r.id === 'bmi');
        expect(bmiResult).toBeDefined();
    });

    it('should be case insensitive', () => {
        const results = searchCalculators('bmi', 'cs', t);
        const resultsUpper = searchCalculators('BMI', 'cs', t);
        expect(results.length).toBe(resultsUpper.length);
    });

    it('should return multiple results for generic query', () => {
        // "a" should typically match many calculators
        const results = searchCalculators('a', 'cs', t);
        expect(results.length).toBeGreaterThan(1);
        expect(results.length).toBeLessThanOrEqual(5); // Default limit
    });

    it('should limit results', () => {
        // Assuming "a" matches many calculators
        const results = searchCalculators('a', 'cs', t, 2);
        expect(results.length).toBeLessThanOrEqual(2);
    });
});

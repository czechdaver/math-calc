/* eslint-disable no-console */
import { searchCalculators } from './calculatorDataUtils';

// Mock t function
const t = (key: string) => key;

console.log("--- Searching for 'bmi' ---");
const resultsBMI = searchCalculators('bmi', 'en', t);
console.log(`Found ${resultsBMI.length} results:`, resultsBMI.map(r => r.id).join(', '));

console.log("\n--- Searching for 'calculator' ---");
const resultsCalc = searchCalculators('calculator', 'en', t);
console.log(`Found ${resultsCalc.length} results:`, resultsCalc.map(r => r.id).join(', '));

console.log("\n--- Searching for 'a' ---");
const resultsA = searchCalculators('a', 'en', t);
console.log(`Found ${resultsA.length} results:`, resultsA.map(r => r.id).join(', '));

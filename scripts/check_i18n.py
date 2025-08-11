#!/usr/bin/env python3
import json
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]
EN_PATH = BASE_DIR / 'src/messages/en.json'
CS_PATH = BASE_DIR / 'src/messages/cs.json'


def load_json(path: Path):
    with path.open('r', encoding='utf-8') as f:
        return json.load(f)


def save_json(path: Path, data: dict):
    with path.open('w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write('\n')


def flatten(d: dict, prefix: str = ''):
    out = {}
    for k, v in d.items():
        key = f"{prefix}.{k}" if prefix else k
        if isinstance(v, dict):
            out.update(flatten(v, key))
        else:
            out[key] = v
    return out


def get_deep(d: dict, path: list):
    cur = d
    for p in path:
        if not isinstance(cur, dict) or p not in cur:
            return None
        cur = cur[p]
    return cur


def set_deep(d: dict, path: list, value):
    cur = d
    for p in path[:-1]:
        if p not in cur or not isinstance(cur[p], dict):
            cur[p] = {}
        cur = cur[p]
    cur[path[-1]] = value


def main():
    en = load_json(EN_PATH)
    cs = load_json(CS_PATH)

    en_f = flatten(en)
    cs_f = flatten(cs)

    missing_in_cs = [k for k in en_f.keys() if k not in cs_f]
    missing_in_en = [k for k in cs_f.keys() if k not in en_f]

    type_mismatches = []
    for k in en_f.keys() & cs_f.keys():
        if type(en_f[k]) is not type(cs_f[k]):
            type_mismatches.append(k)

    # Auto-fix: add missing keys to CS using EN values as placeholders
    added = []
    for k in missing_in_cs:
        path = k.split('.')
        set_deep(cs, path, en_f[k])
        added.append(k)

    # Auto-fix: add missing keys to EN using CS values as placeholders
    added_en = []
    for k in missing_in_en:
        path = k.split('.')
        set_deep(en, path, cs_f[k])
        added_en.append(k)

    # English overrides for keys we know we just added (set proper EN strings instead of CZ placeholders)
    english_overrides = {
        "height_validation_error": "Enter a valid height (50–300 cm)",
        "weight_validation_error": "Enter a valid weight (2–500 kg)",
        "bmi_title": "BMI",
        "common.select_option": "Select option",
        "common.detailed_calculation": "Detailed calculation",
        "calculators.age.total_seconds": "Total seconds",
        "calculators.roi.total_returns": "Total returns",
        "calculators.early_repayment.faq.compound_interest.title": "How does compound interest relate to early repayment?",
        "calculators.early_repayment.faq.compound_interest.description": "Compound interest determines how interest accrues over time. Early repayment reduces principal sooner and lowers total interest paid.",
        "calculators.early_repayment.faq.roi.title": "What is ROI in early repayment analysis?",
        "calculators.early_repayment.faq.roi.description": "ROI compares savings from early repayment to the extra cash used. A higher ROI indicates a more beneficial early repayment.",
        "calculators.early_repayment.faq.npv.title": "Why use NPV for early repayment?",
        "calculators.early_repayment.faq.npv.description": "NPV discounts future savings to their present value, reflecting the time value of money when evaluating early repayment.",
        "category_health_title": "Health and fitness",
        "category_health_description": "Calculators for health, fitness, and body composition",
        "category_math_title": "Mathematical calculations",
        "category_math_description": "Basic math calculators and conversions",
        "category_finance_title": "Finance and economics",
        "category_finance_description": "Financial calculators, taxes, and investments",
        "category_utility_title": "Useful tools",
        "category_utility_description": "Practical calculators for everyday use",
        "quick_links_popular": "Most Popular",
        "quick_links_recent": "Recently Added",
        "percentage_calculator_title": "Percentage Calculator",
        "percentage_calculator_description": "Calculate percentages, discounts, and ratios",
    }

    if english_overrides:
        for key, val in english_overrides.items():
            path = key.split('.')
            set_deep(en, path, val)

    # Czech overrides for keys we just auto-filled from EN (set proper CZ strings)
    czech_overrides = {
        "calculators.age.years": "let",
        "calculators.age.months": "měsíců",
        "calculators.age.days": "dní",
        "calculators.roi.annualized_roi_result": "Annualizované ROI",
        "calculators.early_repayment.related.annuity.title": "Anuitní splátka",
        "calculators.early_repayment.related.annuity.description": "Výpočet výše anuitní splátky úvěru",
        "calculators.early_repayment.related.compound_interest.title": "Složené úročení",
        "calculators.early_repayment.related.compound_interest.description": "Výpočet růstu s úrokem z úroku v čase",
        "calculators.early_repayment.related.roi.title": "ROI",
        "calculators.early_repayment.related.roi.description": "Návratnost investice v procentech",
        "calculators.early_repayment.related.npv.title": "NPV",
        "calculators.early_repayment.related.npv.description": "Čistá současná hodnota peněžních toků",
        "calculators.fuel.select_option": "Vyberte možnost",
        "unit_converter_calculator_title": "Převodník jednotek",
        "unit_converter_calculator_description": "Převod mezi různými jednotkami",
        "fractions_calculator_description": "Počítání se zlomky – sčítání, odčítání, násobení, dělení",
    }

    if czech_overrides:
        for key, val in czech_overrides.items():
            path = key.split('.')
            set_deep(cs, path, val)

    # Save files if modified or overridden
    if added or czech_overrides:
        save_json(CS_PATH, cs)
    if added_en or english_overrides:
        save_json(EN_PATH, en)

    print('i18n audit complete')
    print('- Added to cs.json:', len(added))
    if added:
        for kk in added[:200]:
            print('  +', kk)
        if len(added) > 200:
            print(f"  ... +{len(added)-200} more")

    print('- Added to en.json:', len(added_en))
    if added_en:
        for kk in added_en[:200]:
            print('  +', kk)
        if len(added_en) > 200:
            print(f"  ... +{len(added_en)-200} more")

    print('- Type mismatches:', len(type_mismatches))
    if type_mismatches:
        for kk in type_mismatches[:200]:
            print('  *', kk)
        if len(type_mismatches) > 200:
            print(f"  ... +{len(type_mismatches)-200} more")


if __name__ == '__main__':
    try:
        main()
    except Exception as e:
        print('ERROR:', e)
        sys.exit(1)

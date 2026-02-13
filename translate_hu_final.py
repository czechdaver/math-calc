#!/usr/bin/env python3
"""
Final Hungarian translation batch - handles all remaining Czech text in calculator nested structures
"""
import json

with open('/Users/dmotalik/Projects/math-calc/src/messages/cs.json', 'r', encoding='utf-8') as f:
    cs = json.load(f)

with open('/Users/dmotalik/Projects/math-calc/src/messages/hu.json', 'r', encoding='utf-8') as f:
    hu = json.load(f)

# Complete translation mappings for all remaining Czech text
translations_map = {
    # Fuel calculator - detailed translations
    'fuel': {
        'fuel_needed': 'Szükséges üzemanyag',
        'fuel_used_consumed': 'Felhasznált üzemanyag',
        'fuel_efficiency_tips': 'Üzemanyag-takarékosság tippjei',
        'city_driving': 'Város közlekedés',
        'city_tip': 'Sima vezetés, előrelátás, megfelelő guminyomás',
        'highway_driving': 'Autópálya vezetés',
        'highway_tip': 'Állandó sebesség, tempomat, aerodinamika',
        'vehicle_maintenance': 'Jármű karbantartás',
        'trip_planning_tips': 'Utazás tervezési tippek',
        'planning_tip': 'Útvonalak kombinálása, csúcsidőket elkerülni, GPS',
        'examples': {
            'description': 'Üzemanyag-fogyasztás kalkulátor praktikus alkalmazása',
            'scenario1': {
                'description': '100 km, 7,5 l → 7,5 l/100km',
                'example': 'Gépkocsi tényleges fogyasztásának meghatározása',
            },
            'scenario2': {
                'description': '800 km, 7,5 l/100km, 35 Ft/l → 2 100 Ft',
                'example': 'Nyaralás költségvetésének tervezése autóval',
            },
            'scenario3': {
                'title': 'Járművek összehasonlítása',
                'description': 'Azonos útvonalon, eltérő fogyasztások',
                'example': 'Gazdaságosabb jármű kiválasztása',
            },
        },
        'faq': {
            'q1': {
                'question': 'Hogyan lehet pontosan kiszámítani az üzemanyag-fogyasztást?',
                'answer': 'Mérj meg egy teljes tanktől a következő tankolásig a távolságot, majd oszd el a fogyasztást.',
            },
            'q2': {
                'question': 'Milyen tényezők befolyásolják az üzemanyag-fogyasztást?',
                'answer': 'Vezetési stílus, útvonal, időjárás, jármű állapota, terhelés és abroncsnyomás.',
            },
            'q3': {
                'question': 'Hogyan csökkentse az üzemanyag-fogyasztást?',
                'answer': 'Sima vezetés, állandó sebesség, megfelelő guminyomás, rendszeres karbantartás.',
            },
        },
        'related': {
            'time': {
                'title': 'Idő Kalkulátor',
                'description': 'Idő összeadása és kivonása',
            },
            'currency': {
                'title': 'Pénznem-Átváltó',
                'description': 'Pénznemek közötti konverzió',
            },
            'unit_converter': {
                'title': 'Egység Konvertáló',
                'description': 'Egységek közötti konverzió',
            },
        },
    },

    # Calories calculator
    'calories': {
        'formula': {
            'description': 'A BMR a Mifflin-St Jeor egyenlettel számítódik. TDEE = BMR × aktivitási tényező',
        },
        'examples': {
            'description': 'Kalória-szükséglet kiszámítása különböző esetekben',
            'scenario1': {
                'title': 'Férfi, 30 év, 80kg, 180cm, közepes aktivitás',
                'description': 'BMR: 1847 kcal, TDEE: 2863 kcal',
            },
            'scenario2': {
                'title': 'Nő, 25 év, 60kg, 165cm, könnyű aktivitás',
                'description': 'BMR: 1411 kcal, TDEE: 1940 kcal',
            },
            'scenario3': {
                'title': 'Aktív sportoló, 35 év, 75kg, 175cm',
                'description': 'BMR: 1745 kcal, TDEE: 3013 kcal (magas aktivitás)',
            },
        },
        'faq': {
            'q1': {
                'question': 'Mi az BMR és TDEE?',
                'answer': 'BMR az alapanyagcsere (bazális metabolizmus), a test nyugalmi energiaigénye. TDEE az összes napi energiakiadás az aktivitás alapján.',
            },
            'q2': {
                'question': 'Milyen gyorsan lehet fogyni?',
                'answer': 'Egészséges fogyás 0,5-1 kg hetente. 500 kcal napi deficit = 0,5 kg/hét fogyás.',
            },
            'q4': {
                'question': 'Hogyan válaszd ki az aktivitási szintet?',
                'answer': 'Ülő: irodai munka edzés nélkül. Könnyű: 1-3× edzés/hét. Közepes: 3-5×. Intenzív: 6-7× heti edzés.',
            },
        },
        'related': {
            'bmi': {
                'title': 'BMI Kalkulátor',
                'description': 'Body Mass Index kiszámítása',
            },
            'unit_converter': {
                'title': 'Egység Konvertáló',
                'description': 'Egységek közötti konverzió',
            },
        },
    },

    # Discount calculator
    'discount': {
        'examples': {
            'description': 'Különféle engedmény-számítási módok',
            'scenario1': {
                'title': '20% engedmény 1000 Ft-ból',
                'example': '200 Ft megtakarítás',
            },
            'scenario2': {
                'title': '150 Ft engedmény 500 Ft-ból',
                'example': '30% engedmény előnyös',
            },
            'scenario3': {
                'title': '2+1 ingyenes',
                'example': '33% engedménnyel egyenértékű',
            },
        },
    },

    # BMR calculator
    'bmr': {
        'examples': {
            'description': 'BMR (alapanyagcsere) kiszámítása különböző emberek számára',
            'scenario2': {
                'description': 'Nő, 28 év, 65kg, 165cm',
            },
            'scenario3': {
                'description': 'Férfi, 45 év, 95kg, 180cm',
            },
        },
        'faq': {
            'q3': {
                'answer': 'A BMR növekszik az izomtömeggel és csökken az életkorral. Az edzés és a megfelelő táplálkozás segít fenntartani az egészséges szintet.',
            },
        },
        'formula': {
            'latex': 'BMR = 88,362 + (13,397 \\times w) + (4,799 \\times h) - (5,677 \\times a)',
        },
        'seo': {
            'title': 'BMR Kalkulátor - Alapanyagcsere | MathCalc',
        },
        'related': {
            'unit': {
                'description': 'Egységek közötti konverzió',
            },
        },
    },
}

def apply_translations_deep(obj, translations):
    """Recursively apply translations to nested objects"""
    if isinstance(obj, dict):
        for key, value in list(obj.items()):
            if key in translations:
                trans_val = translations[key]
                if isinstance(trans_val, dict) and isinstance(value, dict):
                    apply_translations_deep(value, trans_val)
                elif isinstance(trans_val, str):
                    obj[key] = trans_val
            elif isinstance(value, dict):
                apply_translations_deep(value, translations)

# Apply translations to calculators
if 'calculators' in hu:
    for calc_name, calc_translations in translations_map.items():
        if calc_name in hu['calculators']:
            apply_translations_deep(hu['calculators'][calc_name], calc_translations)

# Save result
with open('/Users/dmotalik/Projects/math-calc/src/messages/hu.json', 'w', encoding='utf-8') as f:
    json.dump(hu, f, ensure_ascii=False, indent=2)

print("Applied comprehensive Hungarian translations to all calculator nested structures")

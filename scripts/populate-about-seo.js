const fs = require('fs');
const path = require('path');

const locales = ['en', 'cs', 'sk', 'pl', 'hu'];
const messagesDir = path.join(__dirname, '../src/messages');

const aboutSeoTexts = {
    en: "MathCalc Pro is a comprehensive collection of precise, easy-to-use online calculators designed to help you solve everyday math problems. Whether you need financial calculators for mortgage and loans, health calculators like BMI and BMR, construction calculators for material estimates, or basic mathematics tools, our platform provides fast, reliable, and completely free solutions. We aim to simplify your daily calculations and empower you to make informed decisions effortlessly.",
    cs: "MathCalc Pro je komplexní sbírka přesných a snadno použitelných online kalkulaček navržených tak, aby vám pomohly řešit každodenní matematické problémy. Ať už potřebujete finanční kalkulačky pro hypotéky a půjčky, zdravotní kalkulačky jako BMI a BMR, stavební kalkulačky pro odhady materiálů, nebo základní matematické nástroje, naše platforma poskytuje rychlá, spolehlivá a zcela bezplatná řešení. Naším cílem je zjednodušit vaše každodenní výpočty a usnadnit vám informovaná rozhodnutí.",
    sk: "MathCalc Pro je komplexná zbierka presných a ľahko použiteľných online kalkulačiek navrhnutých tak, aby vám pomohli riešiť každodenné matematické problémy. Či už potrebujete finančné kalkulačky pre hypotéky a pôžičky, zdravotné kalkulačky ako BMI a BMR, stavebné kalkulačky pre odhady materiálov, alebo základné matematické nástroje, naša platforma poskytuje rýchle, spoľahlivé a úplne bezplatné riešenia. Naším cieľom je zjednodušiť vaše každodenné výpočty.",
    pl: "MathCalc Pro to wszechstronna kolekcja precyzyjnych i łatwych w użyciu kalkulatorów internetowych zaprojektowanych, aby pomóc Ci rozwiązywać codzienne problemy matematyczne. Niezależnie od tego, czy potrzebujesz kalkulatorów finansowych do kredytów hipotecznych i pożyczek, kalkulatorów zdrowotnych, takich jak BMI i BMR, kalkulatorów budowlanych do szacowania materiałów, czy podstawowych narzędzi matematycznych, nasza platforma zapewnia szybkie, niezawodne i całkowicie darmowe rozwiązania.",
    hu: "A MathCalc Pro a pontos és könnyen használható online számológépek átfogó gyűjteménye, amely segít a mindennapi matematikai problémák megoldásában. Akár pénzügyi számológépekre van szüksége jelzáloghitelekhez, egészségügyi számológépekre, mint a BMI és a BMR, építőipari számológépekre az anyagbecslésekhez, vagy alapvető matematikai eszközökre, platformunk gyors, megbízható és teljesen ingyenes megoldásokat kínál. Célunk, hogy egyszerűsítsük a mindennapi számításokat."
};

locales.forEach(locale => {
    const filePath = path.join(messagesDir, `${locale}.json`);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        if (data.about) {
            data.about.content = aboutSeoTexts[locale] || aboutSeoTexts['en'];
        }

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
        console.log(`Updated about SEO text for ${locale}.json`);
    }
});

const fs = require('fs');
const path = require('path');

const locales = ['en', 'cs', 'sk', 'pl', 'hu'];
const messagesDir = path.join(__dirname, '../src/messages');

locales.forEach(locale => {
    const filePath = path.join(messagesDir, `${locale}.json`);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        if (!data.footer) {
            data.footer = {};
        }

        // Add new footer.navigation translation if it doesn't exist
        if (!data.footer.navigation) {
            const translations = {
                en: 'Navigation',
                cs: 'Rýchlé odkazy',
                sk: 'Rýchle odkazy',
                pl: 'Szybkie linki',
                hu: 'Navigáció'
            };
            data.footer.navigation = translations[locale] || 'Navigation';
        }

        // Unused keys to remove
        const keysToRemove = [
            ['footer', 'about', 'title'],
            ['footer', 'about', 'team'],
            ['footer', 'about', 'careers'],
            ['footer', 'about', 'blog'],
            ['footer', 'support', 'title'],
            ['footer', 'support', 'help_center'],
            ['footer', 'support', 'faq'],
            ['footer', 'resources', 'title'],
            ['footer', 'resources', 'documentation'],
            ['footer', 'resources', 'api'],
            ['footer', 'resources', 'status']
        ];

        keysToRemove.forEach(pathArr => {
            let current = data;
            for (let i = 0; i < pathArr.length - 1; i++) {
                if (!current[pathArr[i]]) break;
                current = current[pathArr[i]];
            }
            if (current && current[pathArr[pathArr.length - 1]]) {
                delete current[pathArr[pathArr.length - 1]];
            }
        });

        // Cleanup empty objects
        if (data.footer.resources && Object.keys(data.footer.resources).length === 0) {
            delete data.footer.resources;
        }

        // We intentionally keep 'company' key in 'about' (used for About page link) and 'contact' in 'support' (used for Contact page link)

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
        console.log(`Cleaned unused keys from ${locale}.json`);
    }
});

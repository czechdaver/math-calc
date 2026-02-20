const fs = require('fs');
const path = require('path');

const locales = ['en', 'cs', 'sk', 'pl', 'hu'];
const messagesDir = path.join(__dirname, '../src/messages');

const newKeys = {
    "legal": {
        "terms_title": "Terms of Service",
        "terms_content": "These are the terms of service.",
        "cookies_title": "Cookie Policy",
        "cookies_content": "This is our cookie policy."
    },
    "about": {
        "title": "About Us",
        "content": "Learn more about MathCalc Pro."
    },
    "contact": {
        "title": "Contact Us",
        "content": "Get in touch with us.",
        "email": "info@example.com"
    }
};

locales.forEach(locale => {
    const filePath = path.join(messagesDir, `${locale}.json`);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Merge new keys
        data.legal = { ...data.legal, ...newKeys.legal };
        data.about = { ...data.about, ...newKeys.about };
        data.contact = { ...data.contact, ...newKeys.contact };

        // Also update privacy_policy for english to ensure consistency, 
        // actually, let's keep privacy_policy as is, and just use it.

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
        console.log(`Updated ${locale}.json`);
    } else {
        console.log(`File not found: ${filePath}`);
    }
});

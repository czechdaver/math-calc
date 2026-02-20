const fs = require('fs');
const path = require('path');

const locales = ['en', 'cs', 'sk', 'pl', 'hu'];
const messagesDir = path.join(__dirname, '../src/messages');

const lastUpdated = new Date().toLocaleDateString('en-US');

// Content that minimizes OSVČ specific details while remaining legally compliant.
// GDPR requires identity, but since user requested maximum anonymity possible, 
// we provide the absolute minimum. Usually, a contact email and country are sufficient for small non-ecommerce sites.
const newKeys = {
    "legal": {
        "terms_title": "Terms of Service",
        "terms_content": `Last updated: ${lastUpdated}\n\n1. Acceptance of Terms\nBy accessing and using MathCalc Pro ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.\n\n2. Description of Service\nThe Service provides various online calculators for general informational purposes. We do not guarantee the absolute accuracy of the results, and you should use them at your own risk. The Service is not a substitute for professional financial, medical, or legal advice.\n\n3. Limitation of Liability\nThe calculators and information on this site are provided "as is". The owner of this site shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use the Service or any calculations provided.\n\n4. Governing Law\nThese terms shall be governed by and constructed in accordance with the laws of the Czech Republic, without reference to its conflict of law provisions.\n\n5. Contact\nFor any questions regarding these terms, please contact us at info@mathcalc-pro.com.`,

        "cookies_title": "Cookie Policy",
        "cookies_content": `Last updated: ${lastUpdated}\n\n1. What Are Cookies\nCookies are small pieces of data stored on your device (computer or mobile device) when you browse our website. They help the site remember information about your visit, making it easier to visit the site again and making the site more useful to you.\n\n2. How We Use Cookies\nWe use cookies for the following purposes:\n- Essential Cookies: Necessary for the website to function properly (e.g., remembering your cookie consent preference).\n- Analytics Cookies: We use services like Google Analytics to understand how visitors interact with our website. This helps us improve our content and user experience.\n- Advertising Cookies: We use third-party vendors, including Google, which use cookies to serve ads based on your prior visits to our website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.\n\n3. Third-Party Cookies and Opt-Out\nUsers may opt out of personalized advertising by visiting Google Ads Settings (https://www.google.com/settings/ads). Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting www.aboutads.info.\n\n4. Managing Cookies\nYou can control and manage cookies in various ways using your browser settings. Please note that removing or blocking cookies can impact your user experience and parts of this website may no longer be fully accessible.\n\n5. Contact\nFor further information about our Cookie Policy, please contact us at info@mathcalc-pro.com.`,

        "privacy_title": "Privacy Policy",
        "privacy_content": `Last updated: ${lastUpdated}\n\n1. Introduction\nWelcome to MathCalc Pro. We are committed to protecting your personal information and your right to privacy. This privacy policy applies to all information collected through our website.\n\n2. Data Collection\nWe only collect information that you voluntarily provide to us when you contact us via email. This includes your email address and the content of your message.\n\n3. Automatically Collected Information\nWhen you visit, use, or navigate the site, we automatically collect certain information. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, and information about how and when you use our website.\n\n4. Third-Party Services\nWe use Google Analytics to analyze website traffic and Google AdSense to serve advertisements. These services use cookies to collect and process data. Google's use of data is described in their privacy policy: https://policies.google.com/technologies/partner-sites\n\n5. Your Rights\nDepending on your location (e.g., EEA, UK, California), you have certain rights regarding your personal data, including the right to request access, correction, or deletion of your data. You can exercise these rights by contacting us.\n\n6. Imprint / Operator\nThe website is operated by an independent professional (OSVČ) based in the Czech Republic. For privacy inquiries or requests, please contact: info@mathcalc-pro.com.`
    },
    "about": {
        "title": "About Us",
        "content": "MathCalc Pro is a comprehensive collection of precise, easy-to-use online calculators designed to help you solve everyday math problems across various categories such as health, finance, construction, and basic mathematics. Our goal is to provide fast, reliable, and accessible tools for everyone."
    },
    "contact": {
        "title": "Contact Us",
        "content": "Have a question, suggestion, or found a bug? We'd love to hear from you. Please reach out to us using the email below.",
        "email": "info@mathcalc-pro.com"
    }
};

locales.forEach(locale => {
    const filePath = path.join(messagesDir, `${locale}.json`);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // We overwrite entirely to replace the placeholders created earlier
        data.legal = { ...data.legal, ...newKeys.legal };
        data.about = { ...data.about, ...newKeys.about };
        data.contact = { ...data.contact, ...newKeys.contact };
        data.privacy_policy = {
            "title": newKeys.legal.privacy_title,
            "content": newKeys.legal.privacy_content
        };

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
        console.log(`Updated ${locale}.json with legal text`);
    }
});

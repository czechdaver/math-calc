// src/app/[locale]/contact/page.tsx
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

const ContactPage: React.FC = () => {
  const t = useTranslations();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{t('footer.contact')}</h1>
      <p className="text-gray-700 mb-6">This is a placeholder contact page. A contact form will be added here.</p>
      <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
        <li>Purpose: Allow users to reach the site owner/admin.</li>
        <li>Fields: name, email, subject, message.</li>
        <li>Privacy: messages handled according to privacy policy.</li>
      </ul>
    </div>
  );
};

export default ContactPage;

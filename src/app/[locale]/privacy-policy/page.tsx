// src/app/[locale]/privacy-policy/page.tsx
import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Zásady ochrany osobních údajů</h1>
      <p>Tato stránka obsahuje zásady ochrany osobních údajů.</p>
      {/* TODO: Přidat detailní obsah zásad ochrany osobních údajů */}
    </div>
  );
};

export default PrivacyPolicyPage;

"use client";
// src/components/ads/AdBanner.tsx
import React, { useEffect } from 'react';

interface AdBannerProps {
  placement: 'header' | 'in-content' | 'sidebar' | 'sticky-bottom';
  // TODO: Přidat props pro AdSense/Ad Manager ID (data-ad-client, data-ad-slot)
}

const AdBanner: React.FC<AdBannerProps> = ({ placement }) => {

  useEffect(() => {
    // Načtení skriptu Google Ads (asynchronně)
    // TODO: Zvážit načtení hlavního skriptu v layout.tsx pro celý web
    const script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ADS_CLIENT_ID'; // TODO: Nahradit YOUR_ADS_CLIENT_ID skutečným ID
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.body.appendChild(script);

    // Zobrazení reklamy
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("Google Ads error: ", e);
    }

     // Cleanup skriptu při odmontování komponenty (důležité pro SPA/Next.js navigaci)
     return () => {
       // Toto může být složité a nemusí vždy fungovat ideálně s Google Ads skriptem
       // Lze zvážit jiný přístup pro načítání skriptu
     };

  }, [placement]); // Znovu načíst reklamu při změně umístění

  // TODO: Dynamicky nastavit třídy CSS a případně velikost reklamy na základě placement
  let adContainerClasses = 'my-4'; // Základní odsazení
  let adSlotId = 'YOUR_ADS_SLOT_ID'; // TODO: Nahradit placeholder a dynamicky nastavit dle placement
  let adLayoutKey = ''; // Pro advanced Ad Manager nastavení

  // You can now modify adContainerClasses based on the 'placement' prop
  switch (placement) {
    case 'header':
      adContainerClasses = 'mt-0 mb-4'; // Example: different margin for header
      adSlotId = 'YOUR_HEADER_ADS_SLOT_ID'; // Example: different slot ID for header
      break;
    case 'in-content':
      adContainerClasses = 'my-4'; // Default margin for in-content
      adSlotId = 'YOUR_IN_CONTENT_ADS_SLOT_ID'; // Example: different slot ID for in-content
      break;
    case 'sidebar':
      adContainerClasses = 'ml-4 my-4'; // Example: different margin for sidebar
      adSlotId = 'YOUR_SIDEBAR_ADS_SLOT_ID'; // Example: different slot ID for sidebar
      break;
    case 'sticky-bottom':
      adContainerClasses = 'fixed bottom-0 left-0 right-0 my-0'; // Example: fixed position for sticky-bottom
      adSlotId = 'YOUR_STICKY_BOTTOM_ADS_SLOT_ID'; // Example: different slot ID for sticky-bottom
      break;
    default:
      adContainerClasses = 'my-4'; // Default
      adSlotId = 'YOUR_DEFAULT_ADS_SLOT_ID'; // Default
  }


  return (
    <div className={adContainerClasses}>
      {/* TODO: Implementovat skutečné zobrazení reklamy pomocí Google Ads tagů */}
      <p className="text-center text-gray-500">Advertisement ({placement})</p>
       <ins className="adsbygoogle"
           style={{ display: 'block' }}
           data-ad-client="ca-pub-YOUR_ADS_CLIENT_ID" // TODO: Nahradit skutečným ID
           data-ad-slot={adSlotId}
           data-ad-format="auto"
           data-full-width-responsive="true"
           data-ad-layout-key={adLayoutKey}></ins>
    </div>
  );
};

export default AdBanner;

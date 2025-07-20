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
  const adContainerClasses = 'my-4'; // Základní odsazení
  let adSlotId = 'YOUR_ADS_SLOT_ID'; // TODO: Nahradit placeholder a dynamicky nastavit dle placement
  let adLayoutKey = ''; // Pro advanced Ad Manager nastavení

  switch (placement) {
    case 'header':
      // Příklad pro header banner (např. 728x90 desktop)
      adContainerClasses += ' w-full h-[90px]'; // Příklad velikosti, upravit podle potřeby
      adSlotId = 'YOUR_HEADER_ADS_SLOT_ID'; // TODO: Skutečné ID
      break;
    case 'in-content':
      // Příklad pro in-content reklamu (např. 300x250)
      adContainerClasses += ' w-[300px] h-[250px] mx-auto'; // Příklad velikosti a centrování
       adSlotId = 'YOUR_IN_CONTENT_ADS_SLOT_ID'; // TODO: Skutečné ID
      break;
    case 'sidebar':
      // Příklad pro sidebar reklamu (např. 160x600)
      adContainerClasses += ' w-[160px] h-[600px]'; // Příklad velikosti
      adSlotId = 'YOUR_SIDEBAR_ADS_SLOT_ID'; // TODO: Skutečné ID
      break;
    case 'sticky-bottom':
      // Příklad pro sticky bottom na mobilu (např. 320x50)
      adContainerClasses += ' fixed bottom-0 left-0 right-0 z-50 w-full h-[50px]'; // Příklad pozicování a velikosti
      adSlotId = 'YOUR_STICKY_BOTTOM_ADS_SLOT_ID'; // TODO: Skutečné ID
      break;
  }

  return (
    <div className={adContainerClasses}>
      <ins className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-YOUR_ADS_CLIENT_ID" // TODO: Nahradit skutečným ID
        data-ad-slot={adSlotId}
        // data-ad-format="auto"
        // data-full-width-responsive="true"
        // TODO: Přidat další datové atributy podle potřeby (např. data-ad-format, data-full-width-responsive)
      ></ins>
    </div>
  );
};

export default AdBanner;

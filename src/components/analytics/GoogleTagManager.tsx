'use client';

import Script from 'next/script';

/**
 * Google Tag Manager component that loads the GTM script and initializes the data layer.
 * This should be placed in the <head> of the document.
 */
export const GoogleTagManager = () => {
  if (!process.env.NEXT_PUBLIC_GTM_ID) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Google Tag Manager ID is not set. Please add NEXT_PUBLIC_GTM_ID to your environment variables.');
    }
    return null;
  }

  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <Script
      id="gtm-script"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `,
      }}
    />
  );
};

/**
 * Google Tag Manager (noscript) component.
 * This should be placed immediately after the opening <body> tag.
 */
export const GoogleTagManagerNoScript = () => {
  if (!process.env.NEXT_PUBLIC_GTM_ID) {
    return null;
  }

  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  );
};

export default GoogleTagManager;

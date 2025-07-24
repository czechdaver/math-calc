'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface GoogleAdsenseProps {
  publisherId?: string;
  debug?: boolean;
}

/**
 * GoogleAdsense component that loads the Google AdSense script once
 * and handles page-level ad settings.
 */
export const GoogleAdsense: React.FC<GoogleAdsenseProps> = ({
  publisherId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID || 'ca-pub-YOUR_ADS_CLIENT_ID',
  debug = process.env.NODE_ENV === 'development',
}) => {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if script is already loaded
    if (document.querySelector('script[src*="pagead2.googlesyndication.com"]')) {
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onerror = () => console.error('Failed to load Google AdSense script');

    // Add data-adtest if in debug mode
    if (debug) {
      script.setAttribute('data-adtest', 'on');
    }

    // Add script to the page
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      if (script.parentNode) {
        document.head.removeChild(script);
      }
    };
  }, [publisherId, debug]);

  // Update page-level ad settings when route changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // @ts-ignore
    window.adsbygoogle = window.adsbygoogle || [];
    
    // Push page-level configuration
    // @ts-ignore
    window.adsbygoogle.push({
      google_ad_client: publisherId,
      enable_page_level_ads: true,
      overlays: { bottom: true },
    });

    // Log page view for ads
    try {
      // @ts-ignore
      if (window.adsbygoogle && window.adsbygoogle.push) {
        // @ts-ignore
        window.adsbygoogle.push({});
      }
    } catch (e) {
      console.error('Error pushing ads:', e);
    }
  }, [pathname, publisherId]);

  return null;
};

export default GoogleAdsense;

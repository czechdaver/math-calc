"use client";
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AdBannerProps {
  placement: 'header' | 'in-content' | 'sidebar' | 'sticky-bottom';
  className?: string;
  adClient?: string;
  adSlot?: string;
  adFormat?: string;
  adLayout?: string;
  adLayoutKey?: string;
  fullWidthResponsive?: boolean;
  enableAdBlockDetection?: boolean;
  onAdBlockDetected?: () => void;
}

const AdBanner: React.FC<AdBannerProps> = ({
  placement,
  className,
  adClient = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID || 'ca-pub-YOUR_ADS_CLIENT_ID',
  adSlot = 'YOUR_AD_SLOT_ID',
  adFormat = 'auto',
  adLayout,
  adLayoutKey,
  fullWidthResponsive = true,
  enableAdBlockDetection = true,
  onAdBlockDetected,
}) => {
  const [adBlockDetected, setAdBlockDetected] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);

  // Check for ad blockers
  useEffect(() => {
    if (typeof window === 'undefined' || !enableAdBlockDetection) return;

    const checkAdBlock = async () => {
      try {
        // Try to load a known ad URL
        await fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', {
          method: 'HEAD',
          mode: 'no-cors',
        }).catch(() => {
          // This will be caught if the request is blocked by an ad blocker
          setAdBlockDetected(true);
          onAdBlockDetected?.();
          console.warn('Ad blocker detected');
        });
      } catch (e) {
        setAdBlockDetected(true);
        onAdBlockDetected?.();
      }
    };

    checkAdBlock();
  }, [enableAdBlockDetection, onAdBlockDetected]);

  // Load Google AdSense script
  useEffect(() => {
    if (adBlockDetected) return;

    // Check if script is already loaded
    if (document.querySelector('script[src*="pagead2.googlesyndication.com"]')) {
      pushAd();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      pushAd();
      setAdLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load Google AdSense script');
      setAdBlockDetected(true);
      onAdBlockDetected?.();
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, [adBlockDetected, adClient, onAdBlockDetected]);

  // Push ad to Google AdSense
  const pushAd = () => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('Google Ads error:', e);
    }
  };

  // Get styles based on ad placement
  const getAdStyles = () => {
    switch (placement) {
      case 'header':
        return {
          container: 'w-full h-24 md:h-32 flex items-center justify-center bg-gray-100 dark:bg-gray-800',
          ad: 'w-full h-full max-w-5xl mx-auto',
        };
      case 'in-content':
        return {
          container: 'w-full my-8 flex items-center justify-center',
          ad: 'w-full max-w-4xl mx-auto min-h-[90px] md:min-h-[250px]',
        };
      case 'sidebar':
        return {
          container: 'hidden lg:block w-full',
          ad: 'w-full min-h-[600px]',
        };
      case 'sticky-bottom':
        return {
          container: 'fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg z-50',
          ad: 'w-full max-w-4xl mx-auto h-20',
        };
      default:
        return {
          container: 'w-full',
          ad: 'w-full',
        };
    }
  };

  const { container: containerClass, ad: adClass } = getAdStyles();
  const containerStyle = placement === 'sticky-bottom' ? { display: 'none' } : {};

  // Don't render if ad blocker is detected
  if (adBlockDetected) {
    return null;
  }

  return (
    <div 
      className={cn(containerClass, className, {
        'animate-pulse bg-gray-100 dark:bg-gray-800': !adLoaded,
      })}
      style={containerStyle}
    >
      <ins
        className={`adsbygoogle ${adClass}`}
        style={{ display: 'block' }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-layout={adLayout}
        data-ad-layout-key={adLayoutKey}
        data-full-width-responsive={fullWidthResponsive.toString()}
        data-adtest={process.env.NODE_ENV === 'development' ? 'on' : 'off'}
      />
    </div>
  );
};

export default AdBanner;

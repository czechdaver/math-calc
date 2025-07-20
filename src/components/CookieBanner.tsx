'use client';

import { useState, useEffect } from 'react';

const COOKIE_CONSENT_KEY = 'cookie_consent'; // Změněn klíč pro uložení detailnějšího stavu
const CONSENT_GRANTED_EVENT = new Event('consentGranted');
const CONSENT_DENIED_EVENT = new Event('consentDenied'); // Nová událost pro odmítnutí

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check local storage for consent on component mount
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // If no consent recorded, show banner
      setIsVisible(true);
    } else if (consent === 'granted') {
      // If consent was already granted, dispatch the event immediately
      window.dispatchEvent(CONSENT_GRANTED_EVENT);
    } else if (consent === 'denied') {
        // If consent was already denied, dispatch the denied event immediately
        window.dispatchEvent(CONSENT_DENIED_EVENT);
    }
  }, []);

  const handleAccept = () => {
    // Set consent in local storage to 'granted'
    localStorage.setItem(COOKIE_CONSENT_KEY, 'granted');
    setIsVisible(false);
    // Dispatch a custom event to notify other parts of the application
    window.dispatchEvent(CONSENT_GRANTED_EVENT);
  };

   const handleDeny = () => {
    // Set consent in local storage to 'denied'
    localStorage.setItem(COOKIE_CONSENT_KEY, 'denied');
    setIsVisible(false);
    // Dispatch a custom event for denied consent
    window.dispatchEvent(CONSENT_DENIED_EVENT);
  };


  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 flex items-center justify-between z-50">
      <p className="text-sm">
        Používáme cookies pro zlepšení vaší zkušenosti. Pro více informací si přečtěte naše
        <a href="/zasady-ochrany-osobnich-udaju" className="underline ml-1">Zásady ochrany osobních údajů</a>.
      </p>
      <div className="flex space-x-2">
        <button
          onClick={handleAccept}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Přijmout vše
        </button>
         <button
          onClick={handleDeny}
          className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
        >
          Odmítnout
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;

/**
 * Google Analytics utilities for tracking page views and events.
 * This module provides a type-safe interface for interacting with Google Analytics.
 */

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: Record<string, any>[];
  }
}

// Google Analytics Measurement ID from environment variables
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// Log page view
export const pageview = (url: string) => {
  if (!GA_MEASUREMENT_ID) return;
  
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });};

// Log specific events
type EventProps = {
  action: string;
  category: string;
  label: string;
  value?: number;
  [key: string]: any;
};

/**
 * Track an event in Google Analytics
 * @param {string} action - The action of the event (e.g., 'click', 'submit')
 * @param {string} category - The category of the event (e.g., 'User', 'Form')
 * @param {string} label - A label for the event
 * @param {number} [value] - An optional numeric value associated with the event
 * @param {Record<string, any>} [additionalParams] - Additional parameters to include with the event
 */
export const event = ({
  action,
  category,
  label,
  value,
  ...additionalParams
}: EventProps) => {
  if (!GA_MEASUREMENT_ID) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    ...additionalParams,
  });
};

/**
 * Track an exception in Google Analytics
 * @param {string} description - Description of the exception
 * @param {boolean} [fatal=false] - Whether the exception was fatal
 */
export const exception = (description: string, fatal = false) => {
  if (!GA_MEASUREMENT_ID) return;
  
  window.gtag('event', 'exception', {
    description,
    fatal,
  });
};

/**
 * Track a page view with additional parameters
 * @param {string} url - The URL of the page
 * @param {string} [title] - The title of the page
 * @param {Record<string, any>} [additionalParams] - Additional parameters to include with the pageview
 */
export const trackPageView = (
  url: string,
  title?: string,
  additionalParams: Record<string, any> = {}
) => {
  if (!GA_MEASUREMENT_ID) return;
  
  window.gtag('event', 'page_view', {
    page_title: title || document.title,
    page_location: window.location.href,
    page_path: url,
    ...additionalParams,
  });
};

/**
 * Track a custom event with a custom name and parameters
 * @param {string} name - The name of the custom event
 * @param {Record<string, any>} params - Parameters to include with the event
 */
export const customEvent = (name: string, params: Record<string, any> = {}) => {
  if (!GA_MEASUREMENT_ID) return;
  
  window.gtag('event', name, params);
};

/**
 * Set user properties in Google Analytics
 * @param {Record<string, any>} properties - User properties to set
 */
export const setUserProperties = (properties: Record<string, any>) => {
  if (!GA_MEASUREMENT_ID) return;
  
  window.gtag('set', 'user_properties', properties);
};

/**
 * Initialize the data layer if it doesn't exist
 */
export const initDataLayer = () => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function() {
      // @ts-ignore
      window.dataLayer.push(arguments);
    };
    
    // Set the current date
    window.gtag('js', new Date());
    
    // Configure with the measurement ID
    if (GA_MEASUREMENT_ID) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        send_page_view: false, // We'll send page views manually
      });
    }
  }
};

// Initialize the data layer when the module is imported
if (typeof window !== 'undefined') {
  initDataLayer();
}

'use client';

import { useEffect, useRef } from 'react';

const GUESTY_CSS_URL = 'https://s3.amazonaws.com/guesty-frontend-production/search-bar-production.css';
const GUESTY_JS_URL = 'https://s3.amazonaws.com/guesty-frontend-production/search-bar-production.js';

const GUESTY_CONFIG = {
  siteUrl: 'sanctuaryvillas.co',
  color: '#206CFF',
};

declare global {
  interface Window {
    GuestySearchBarWidget?: {
      create: (config: typeof GUESTY_CONFIG) => Promise<void>;
    };
  }
}

export default function GuestyWidget() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = GUESTY_CSS_URL;
    link.media = 'all';
    document.head.appendChild(link);

    // Load JS and initialize widget
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = GUESTY_JS_URL;
    script.async = true;

    script.onload = () => {
      try {
        if (window.GuestySearchBarWidget) {
          window.GuestySearchBarWidget.create(GUESTY_CONFIG).catch((error) => {
            console.log('[Guesty Embedded Widget]:', error.message);
          });
        }
      } catch (error) {
        console.log('[Guesty Embedded Widget]:', error);
      }
    };

    const firstScript = document.getElementsByTagName('script')[0];
    firstScript?.parentNode?.insertBefore(script, firstScript);

    return () => {
      // Cleanup on unmount
      link.remove();
      script.remove();
    };
  }, []);

  return <div id="search-widget_IO312PWQ" className="w-full" />;
}

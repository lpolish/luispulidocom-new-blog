'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export default function ReCAPTCHA() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadRecaptcha = () => {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
      script.async = true;
      script.onload = () => {
        window.grecaptcha.ready(() => {
          setIsReady(true);
        });
      };
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    };

    if (typeof window !== 'undefined' && !window.grecaptcha) {
      loadRecaptcha();
    } else if (window.grecaptcha) {
      window.grecaptcha.ready(() => {
        setIsReady(true);
      });
    }
  }, []);

  return null;
} 
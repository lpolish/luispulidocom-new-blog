'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();

  // Pages where reCAPTCHA badge should be visible
  const showBadgePages = ['/', '/blog', '/contact'];

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

      // Add custom CSS for the reCAPTCHA badge
      const style = document.createElement('style');
      style.textContent = `
        .grecaptcha-badge {
          visibility: ${showBadgePages.includes(pathname) ? 'visible' : 'hidden'};
          opacity: ${showBadgePages.includes(pathname) ? '1' : '0'};
          transition: opacity 0.3s ease;
        }
      `;
      document.head.appendChild(style);

      return () => {
        document.body.removeChild(script);
        document.head.removeChild(style);
      };
    };

    if (typeof window !== 'undefined' && !window.grecaptcha) {
      loadRecaptcha();
    } else if (window.grecaptcha) {
      window.grecaptcha.ready(() => {
        setIsReady(true);
      });
    }
  }, [pathname]);

  return null;
} 
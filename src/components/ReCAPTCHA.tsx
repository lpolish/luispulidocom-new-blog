'use client';

import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

interface ReCAPTCHAContextType {
  getToken: (action?: string) => Promise<string | null>;
  isReady: boolean;
}

const ReCAPTCHAContext = createContext<ReCAPTCHAContextType | undefined>(undefined);

export function useReCAPTCHA() {
  const context = useContext(ReCAPTCHAContext);
  if (!context) {
    throw new Error('useReCAPTCHA must be used within ReCAPTCHAProvider');
  }
  return context;
}

interface ReCAPTCHAProviderProps {
  children: ReactNode;
}

export function ReCAPTCHAProvider({ children }: ReCAPTCHAProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const pathname = usePathname();

  // Pages where reCAPTCHA badge should be visible
  const showBadgePages = ['/', '/blog', '/contact'];

  const getToken = async (action: string = 'submit'): Promise<string | null> => {
    if (!isReady || !window.grecaptcha) {
      return null;
    }

    try {
      const token = await window.grecaptcha.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
        { action }
      );
      return token;
    } catch (error) {
      console.error('reCAPTCHA execution error:', error);
      return null;
    }
  };

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

  const value = {
    getToken,
    isReady,
  };

  return (
    <ReCAPTCHAContext.Provider value={value}>
      {children}
    </ReCAPTCHAContext.Provider>
  );
}

// Legacy component for backward compatibility
export default function ReCAPTCHA() {
  return null;
} 
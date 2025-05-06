'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];
  
  return (
    <footer className="bg-background/95 backdrop-blur-sm border-t border-border py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-textMuted text-sm">
              © {currentYear} Luis Pulido Díaz. All rights reserved.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-6"
          >
            <ul className="flex flex-wrap justify-center gap-6">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-textMuted hover:text-accent text-sm transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link 
              href="/rss.xml"
              className="text-textMuted hover:text-accent transition-colors"
              title="RSS Feed"
            >
              <svg 
                className="w-5 h-5" 
                fill="currentColor" 
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M19.199 24c-1.524 0-2.77-1.243-2.77-2.77 0-1.524 1.243-2.77 2.77-2.77 1.524 0 2.77 1.243 2.77 2.77 0 1.524-1.243 2.77-2.77 2.77zm-5.01-2.77c0 2.762-2.248 5.01-5.01 5.01-2.762 0-5.01-2.248-5.01-5.01 0-2.762 2.248-5.01 5.01-5.01 2.762 0 5.01 2.248 5.01 5.01zm-5.01-5.01c-2.762 0-5.01 2.248-5.01 5.01 0 2.762 2.248 5.01 5.01 5.01 2.762 0 5.01-2.248 5.01-5.01 0-2.762-2.248-5.01-5.01-5.01zm-5.01-5.01c-2.762 0-5.01 2.248-5.01 5.01 0 2.762 2.248 5.01 5.01 5.01 2.762 0 5.01-2.248 5.01-5.01 0-2.762-2.248-5.01-5.01-5.01z"/>
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
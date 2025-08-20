'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: 'Chess', href: '/chess' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  // ...existing code...

  const [recentPosts, setRecentPosts] = useState<{ slug: string; title: string }[]>([]);
  const [recentPostsError, setRecentPostsError] = useState(false);
  useEffect(() => {
    fetch('/recent-posts.json')
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setRecentPosts(data);
        } else {
          setRecentPostsError(true);
        }
      })
      .catch(() => setRecentPostsError(true));
  }, []);

  return (
    <footer className="bg-background/95 backdrop-blur-sm border-t border-border py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Navigation column (30%) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="w-full md:w-1/3 flex flex-col items-center"
            >
              <h3 className="text-text font-bold mb-6 text-lg uppercase tracking-wide text-center w-full">Navigation</h3>
              <ul className="space-y-3 w-full">
                {navLinks.map((link) => (
                  <li key={link.name} className="w-full">
                    <Link
                      href={link.href}
                      className="block w-full text-textMuted hover:text-accent text-base font-semibold transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-background/80 text-center"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Recent Posts block (70%) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full md:w-2/3"
            >
              <h3 className="text-text font-semibold mb-6 text-lg uppercase tracking-wide text-center w-full">Recent Posts</h3>
              {recentPostsError || recentPosts.length === 0 ? (
                <div className="flex items-center justify-center text-textMuted text-sm h-full">
                  <span>No recent posts available.</span>
                </div>
              ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentPosts.map((post: { slug: string; title: string }) => (
                    <li key={post.slug} className="flex flex-col gap-2 bg-background/80 rounded-xl shadow-lg p-5 hover:bg-background/95 transition-colors border border-border">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-text font-semibold hover:text-accent text-base transition-colors duration-200 mb-1"
                      >
                        {post.title}
                      </Link>
                      <span className="select-none" aria-hidden="true">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="4" y="7" width="8" height="2" rx="1" fill="currentColor" className="text-accent" />
                        </svg>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="text-textMuted text-sm font-medium tracking-tight flex items-center justify-center gap-2">
              © {currentYear} <span className="font-semibold text-text">Luis Pulido Díaz</span>. All rights reserved.
              <Link
                href="/rss.xml"
                className="text-textMuted hover:text-accent transition-colors"
                title="RSS Feed"
                aria-label="RSS Feed"
              >
                <svg
                  className="w-5 h-5 ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M4.5 17.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0-7a9 9 0 0 1 9 9h2a11 11 0 0 0-11-11v2zm0-5a14 14 0 0 1 14 14h2A16 16 0 0 0 4.5 5v2z" />
                </svg>
              </Link>
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              <Link
                href="/terms-of-service"
                className="text-textMuted hover:text-accent text-xs underline transition-colors"
                title="Terms of Service"
              >
                Terms of Service
              </Link>
              <span className="text-textMuted text-xs">|</span>
              <Link
                href="/privacy"
                className="text-textMuted hover:text-accent text-xs underline transition-colors"
                title="Privacy Policy"
              >
                Privacy Policy
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
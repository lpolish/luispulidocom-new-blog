'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
// Dynamically import ChessGame for client-side only rendering
const ChessGame = dynamic(() => import('./ChessGame'), { ssr: false });

function ChessGameFooterWrapper() {
  // Only render on desktop
  if (typeof window !== 'undefined' && window.innerWidth < 768) return null;
  return <ChessGame />;
}
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  // Removed randomLinks since random pages are deleted

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
            {/* ...existing code for Navigation and Random columns... */}
            {/* Desktop-only Chess Play Section */}
            <div className="hidden md:block col-span-1">
              <h3 className="text-text font-semibold mb-4 text-base uppercase tracking-wide">Play Chess</h3>
              <div
                className="bg-background border border-border rounded-lg p-4 flex flex-col items-center justify-center"
                style={{ minWidth: 220, maxWidth: 340, width: '100%', position: 'relative', overflow: 'visible' }}
              >
                <ChessGameFooterWrapper />
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className=""
            >
              <h3 className="text-text font-semibold mb-4 text-base uppercase tracking-wide">Navigation</h3>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-textMuted hover:text-accent text-base font-medium transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Removed Random section from footer */}

            {recentPostsError || recentPosts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="col-span-2 flex items-center justify-center text-textMuted text-sm"
              >
                <span>No recent posts available.</span>
              </motion.div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  className=""
                >
                  <h3 className="text-text font-semibold mb-4 text-base uppercase tracking-wide">Recent Posts</h3>
                  <ul className="space-y-2">
                    {recentPosts.slice(0, Math.ceil(recentPosts.length / 2)).map((post: { slug: string; title: string }) => (
                      <li key={post.slug} className="flex items-center gap-2">
                        <span className="select-none" aria-hidden="true">
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="2" y="3" width="4" height="2" rx="1" fill="currentColor" className="text-accent" />
                          </svg>
                        </span>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-textMuted hover:text-accent text-base font-medium transition-colors duration-200"
                        >
                          {post.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className=""
                >
                  {/* No title for second column, push items one row below by adding an empty li */}
                  <ul className="space-y-2">
                    <li key="recent-posts-spacer" aria-hidden="true">&nbsp;</li>
                    {recentPosts.slice(Math.ceil(recentPosts.length / 2)).map((post: { slug: string; title: string }) => (
                      <li key={post.slug} className="flex items-center gap-2">
                        <span className="select-none" aria-hidden="true">
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="2" y="3" width="4" height="2" rx="1" fill="currentColor" className="text-accent" />
                          </svg>
                        </span>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-textMuted hover:text-accent text-base font-medium transition-colors duration-200"
                        >
                          {post.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </>
            )}
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
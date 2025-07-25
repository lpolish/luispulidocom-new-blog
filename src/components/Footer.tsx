'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getSortedPostsData } from '@/lib/posts';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  const randomLinks = [
    { name: 'Kaleidoscope', href: '/random/kaleidoscope' },
    { name: 'Smudge Canvas', href: '/random/smudge-canvas' }
  ];

  const recentPosts = [
  { slug: 'photobiomodulation-device-compliance', title: 'Photobiomodulation Device Compliance' },
  { slug: 'hipaa-ai-and-biotech-breakthroughs-mid-2025-update', title: 'Updates in HIPAA, AI, and Biotech: Mid-2025' },
  { slug: 'crystals-kyber-quantum-resistant-encryption', title: 'Understanding CRYSTALS-Kyber and Post-Quantum Security' },
  // ...existing code...
  { slug: 'building-fortified-nextjs-applications', title: 'Building Fortified Next.js Applications' },
  { slug: 'ai-gateways-llms-transform-route-knowledge', title: 'AI Gateways and LLMs: Transforming Knowledge Routing' }
  ];

  return (
    <footer className="bg-background/95 backdrop-blur-sm border-t border-border py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className=""
            >
              <h3 className="text-text font-semibold mb-4 text-base uppercase tracking-wide">Random</h3>
              <ul className="space-y-2">
                {randomLinks.map((link) => (
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className=""
            >
              <h3 className="text-text font-semibold mb-4 text-base uppercase tracking-wide">Recent Posts</h3>
              <ul className="space-y-2">
                {recentPosts.map((post) => (
                  <li key={post.slug}>
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
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
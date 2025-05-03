import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found | Luis Pulido Díaz',
  description: 'The page you are looking for could not be found. Please check the URL or return to the homepage.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-lg text-text/80 mb-8 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Return Home
        </Link>
        <Link
          href="/blog"
          className="px-6 py-3 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
        >
          Browse Blog
        </Link>
      </div>
    </div>
  );
} 
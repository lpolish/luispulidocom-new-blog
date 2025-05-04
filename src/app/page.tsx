import { getFeaturedPosts } from '@/lib/posts';
import { FeaturedPosts } from '@/components/FeaturedPosts';
import SubscribeForm from '@/components/SubscribeForm';
import ReCAPTCHA from '@/components/ReCAPTCHA';
import Link from 'next/link';

export default async function Home() {
  const featuredPosts = await getFeaturedPosts();
  
  return (
    <div className="space-y-32 mb-32">
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-text">
              Unpacking Systems, Software, and Ideas
            </h1>
            <p className="text-2xl text-textMuted leading-relaxed">
              Discover a take on software, architecture, and the craft of technology.
            </p>
            <div className="flex gap-4">
              <Link 
                href="/blog" 
                className="px-6 py-3 bg-accent text-primary rounded-lg font-medium hover:bg-accent/90 transition-colors"
              >
                View Posts
              </Link>
              <Link 
                href="/about" 
                className="px-6 py-3 border border-border rounded-lg font-medium hover:border-accent transition-colors"
              >
                About Me
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section>
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">Latest Insights</h2>
            <Link 
              href="/blog" 
              className="text-accent hover:text-accent/80 transition-colors"
            >
              View all articles →
            </Link>
          </div>
          <FeaturedPosts posts={featuredPosts} />
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-primary/50 backdrop-blur-sm rounded-2xl border border-border p-8">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">Stay Updated</h2>
          <p className="text-textMuted text-lg">
            Subscribe to receive the latest articles and insights directly in your inbox.
          </p>
          <div className="max-w-md mx-auto">
            <SubscribeForm />
          </div>
        </div>
      </section>

      <ReCAPTCHA />
    </div>
  );
}


// Removed import of dynamic and metadata for static rendering
import Link from 'next/link';

export default function About() {
  return (
    <div className="max-w-3xl mx-auto pt-20">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">About</h1>
      <div className="bg-primary rounded-lg p-8 shadow-lg">
        <p className="mb-6">This site is a place to share ideas and connect.</p>
        <div className="mt-8 text-sm text-textMuted">
          <p>You can also find me on <a href="https://github.com/lpolish" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">GitHub</a> and <a href="https://x.com/pulidoman" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">X</a>.</p>
        </div>
        <div className="mt-8">
          <Link href="/contact" className="px-6 py-3 bg-accent text-white rounded-md hover:bg-accent/80 transition-colors inline-block">Contact</Link>
        </div>
      </div>
    </div>
  );
} 
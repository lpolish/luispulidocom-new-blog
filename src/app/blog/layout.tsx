import Link from 'next/link';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold hover:text-accent transition-colors">
            Luis Pulido Díaz
          </Link>
        </div>
      </header>
      <main className="py-8">
        {children}
      </main>
    </div>
  );
} 
import { ReferenceProvider } from '@/contexts/ReferenceContext';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReferenceProvider>
      <div className="min-h-screen">
        <main className="py-8">
          {children}
        </main>
      </div>
    </ReferenceProvider>
  );
} 
export default function Loading() {
  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex items-center justify-center animate-fade-in">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-border rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-textMuted font-mono text-sm tracking-wider animate-fade-in-delayed">
          LOADING
        </p>
      </div>
    </div>
  );
} 
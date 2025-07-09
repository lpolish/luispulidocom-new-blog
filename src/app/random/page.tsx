import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Random | Luis Pulido Díaz",
  description: "Random creative experiments and interactive visualizations",
  openGraph: {
    title: "Random | Luis Pulido Díaz",
    description: "Random creative experiments and interactive visualizations",
  },
};

const RandomPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-text mb-8">Random</h1>
        <p className="text-lg text-textMuted mb-12">
          A collection of creative experiments and interactive visualizations.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link 
            href="/random/kaleidoscope"
            className="group block p-6 bg-card hover:bg-cardHover border border-border rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-accent/10 rounded-lg mb-4 group-hover:bg-accent/20 transition-colors">
              <svg 
                className="w-8 h-8 text-accent" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-text mb-2 group-hover:text-accent transition-colors">
              Kaleidoscope
            </h3>
            <p className="text-textMuted text-sm">
              An interactive kaleidoscope that reacts to your cursor movement. Move your mouse to create beautiful symmetrical patterns.
            </p>
          </Link>
          <Link 
            href="/random/smudge-canvas"
            className="group block p-6 bg-card hover:bg-cardHover border border-border rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-accent/10 rounded-lg mb-4 group-hover:bg-accent/20 transition-colors">
              <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path d="M8 12c1.5-2 6.5-2 8 0" strokeWidth="2" />
                <circle cx="9" cy="10" r="1" fill="currentColor" />
                <circle cx="15" cy="10" r="1" fill="currentColor" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-text mb-2 group-hover:text-accent transition-colors">
              Smudge Canvas
            </h3>
            <p className="text-textMuted text-sm">
              Draw with your mouse or touch to create evolving smudge trails. Colors smoothly transition through palettes for a mesmerizing effect.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RandomPage;

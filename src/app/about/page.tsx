import Link from 'next/link';

export const metadata = {
  title: 'About | Luis Pulido',
  description: 'Learn about Luis Pulido, a software engineer with over 12 years of experience building scalable solutions',
};

export default function About() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">About Me</h1>
      
      <div className="bg-primary rounded-lg p-8 shadow-lg">
        <p className="mb-4">
          I'm Luis, a software engineer who's been building things for over 12 years. I've worked across different industries, always with one goal: making systems that don't just work, but work well.
        </p>
        
        <p className="mb-4">
          I build modern web applications that scale efficiently. I care about clean code, but I care more about solving real problems and delivering results that matter.
        </p>
        
        <p className="mb-8">
          This blog is where I share what I learn along the way. No fluff, just the stuff that matters.
        </p>
        
        <div className="mt-8">
          <Link 
            href="/contact" 
            className="px-6 py-3 bg-accent text-white rounded-md hover:bg-accent/80 transition-colors inline-block"
          >
            Let's Connect
          </Link>
        </div>
      </div>
    </div>
  );
} 
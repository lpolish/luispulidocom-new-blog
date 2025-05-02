import Link from 'next/link';

export const metadata = {
  title: 'About | Luis Pulido',
  description: 'Learn about Luis Pulido, a curious scientist and tech enthusiast',
};

export default function About() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">About Me</h1>
      
      <div className="bg-primary rounded-lg p-8 shadow-lg">
        <p className="mb-4">
          Hello, I'm Luis. I'm a curious scientist and technology enthusiast with a passion for understanding how things work, from networking protocols to artificial intelligence systems.
        </p>
        
        <p className="mb-4">
          This blog is my personal space to explore and share technical insights on topics I find fascinating. I approach technology with curiosity and depth, without the constraints of self-promotion or commercial interests.
        </p>
        
        <p className="mb-4">
          My current interests include:
        </p>
        
        <ul className="list-disc list-inside mb-4 pl-4 space-y-2">
          <li>Networking fundamentals and advanced concepts</li>
          <li>Artificial intelligence and machine learning</li>
          <li>Scientific discoveries and technological innovations</li>
          <li>The intersection of technology and human understanding</li>
        </ul>
        
        <p className="mb-8">
          I believe in approaching complex subjects with clarity and authenticity, making them approachable without oversimplification.
        </p>
        
        <div className="mt-8">
          <Link 
            href="/contact" 
            className="px-6 py-3 bg-accent text-white rounded-md hover:bg-accent/80 transition-colors inline-block"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </div>
  );
} 
import Link from 'next/link';

export const metadata = {
  title: 'Contact | Luis Pulido',
  description: 'Get in touch with Luis Pulido',
};

export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Contact</h1>
      
      <div className="bg-primary rounded-lg p-8 shadow-lg mb-8">
        <p className="mb-6">
          I'm always interested in thoughtful discussions about technology, science, and the topics I write about. Feel free to reach out if you have questions, insights, or just want to connect.
        </p>
        
        <h2 className="text-xl font-semibold mb-4">Connect With Me</h2>
        
        <ul className="space-y-4 mb-8">
          <li className="flex items-center">
            <svg className="w-5 h-5 mr-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Email: <a href="mailto:contact@luispulido.com" className="text-accent hover:underline">contact@luispulido.com</a></span>
          </li>
          <li className="flex items-center">
            <svg className="w-5 h-5 mr-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
            <span>Twitter: <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">@yourusername</a></span>
          </li>
          <li className="flex items-center">
            <svg className="w-5 h-5 mr-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <span>GitHub: <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">github.com/yourusername</a></span>
          </li>
        </ul>
        
        <p className="text-textMuted">
          Please note that while I appreciate all messages, my response time may vary. I'll do my best to get back to you as soon as possible.
        </p>
      </div>
      
      <div className="bg-secondary rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Subscribe to Updates</h2>
        <p className="mb-4">
          If you'd like to be notified when I publish new articles, consider subscribing to the RSS feed.
        </p>
        <a 
          href="/rss.xml" 
          className="inline-flex items-center text-accent hover:text-accent/80"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
          RSS Feed
        </a>
      </div>
    </div>
  );
} 
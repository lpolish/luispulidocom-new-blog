import ContactForm from '@/components/ContactForm';
import ReCAPTCHA from '@/components/ReCAPTCHA';

export const metadata = {
  title: 'Contact | Luis Pulido',
  description: 'Get in touch with Luis Pulido',
};

export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Contact</h1>
      
      <div className="bg-primary rounded-lg p-8 shadow-lg">
        <p className="mb-6">
          Let's talk about building better software.
        </p>
        
        <div className="mt-8">
          <ContactForm />
        </div>

        <div className="mt-8 text-sm text-textMuted">
          <p>You can also find me on <a href="https://github.com/lpolish" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">GitHub</a> and <a href="https://x.com/pulidoman" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">X</a>.</p>
        </div>
      </div>

      <ReCAPTCHA />
    </div>
  );
} 
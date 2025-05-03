import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import 'katex/dist/katex.min.css';

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "Luis Pulido | Technical Blog",
    template: "%s | Luis Pulido"
  },
  description: "A blog about networking, AI, science and technical topics",
  keywords: ["networking", "AI", "science", "technology", "blog", "technical"],
  authors: [{ name: "Luis Pulido" }],
  creator: "Luis Pulido",
  publisher: "Luis Pulido",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://luispulido.com'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://luispulido.com',
    title: 'Luis Pulido | Technical Blog',
    description: 'A blog about networking, AI, science and technical topics',
    siteName: 'Luis Pulido',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luis Pulido | Technical Blog',
    description: 'A blog about networking, AI, science and technical topics',
    creator: '@luispulido',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-background text-text antialiased`}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8 animate-fade-in">
            <div className="max-w-4xl mx-auto">
              {children}
            </div>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

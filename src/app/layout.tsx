import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css';

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "Luis Pulido Díaz | Technical Blog",
    template: "%s | Luis Pulido Díaz"
  },
  description: "A blog about networking, AI, science and technical topics",
  keywords: ["networking", "AI", "science", "technology", "blog", "technical"],
  authors: [{ name: "Luis Pulido Díaz" }],
  creator: "Luis Pulido Díaz",
  publisher: "Luis Pulido Díaz",
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
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://luispulido.com',
    title: 'Luis Pulido Díaz | Technical Blog',
    description: 'A blog about networking, AI, science and technical topics',
    siteName: 'Luis Pulido Díaz',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luis Pulido Díaz | Technical Blog',
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
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
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
        <Analytics />
      </body>
    </html>
  );
}

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Play Chess Online vs AI | Stockfish Chess Game | Luis Pulido Díaz',
  description: 'Challenge yourself with our online chess game powered by Stockfish AI. Play as white or black, test your strategy, and improve your chess skills instantly.',
  keywords: ['chess', 'play chess online', 'chess AI', 'Stockfish', 'Luis Pulido Díaz', 'chess game', 'online chess', 'strategy', 'board game', 'play black chess', 'play white chess', 'AI opponent'],
  openGraph: {
    title: 'Play Chess Online vs AI | Stockfish Chess Game | Luis Pulido Díaz',
    description: 'Challenge yourself with our online chess game powered by Stockfish AI. Play as white or black, test your strategy, and improve your chess skills instantly.',
    type: 'website',
    url: 'https://luispulido.com/chess',
    images: [
      {
        url: 'https://luispulido.com/public/screenshot-desktop.png',
        width: 1200,
        height: 630,
        alt: 'Chess Game Screenshot',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Play Chess Online vs AI | Stockfish Chess Game | Luis Pulido Díaz',
    description: 'Challenge yourself with our online chess game powered by Stockfish AI. Play as white or black, test your strategy, and improve your chess skills instantly.',
    images: ['https://luispulido.com/public/screenshot-desktop.png'],
  },
};
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0F14', // Richer dark background
        primary: '#1A1F2C',    // Dark element background with blue undertone
        secondary: '#2A2F3C',  // Secondary background with depth
        accent: '#00E5FF',     // Brighter, more vibrant accent
        accent2: '#FF6B6B',    // Warmer alternative accent
        text: '#F0F4F8',       // Softer light text
        textMuted: '#8A9BA8',  // More sophisticated muted text
        highlight: '#2A3A4A',  // New highlight color for interactive elements
        border: '#2A3A4A',     // Subtle border color
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#F0F4F8',
            maxWidth: '65ch',
            a: {
              color: '#00E5FF',
              '&:hover': {
                color: '#00c2cb',
                textDecoration: 'underline',
              },
            },
            h1: {
              color: '#F0F4F8',
              fontWeight: '700',
              letterSpacing: '-0.025em',
            },
            h2: {
              color: '#F0F4F8',
              fontWeight: '600',
              letterSpacing: '-0.025em',
            },
            h3: {
              color: '#F0F4F8',
              fontWeight: '600',
            },
            h4: {
              color: '#F0F4F8',
              fontWeight: '600',
            },
            blockquote: {
              color: '#8A9BA8',
              borderLeftColor: '#2A3A4A',
              fontStyle: 'italic',
            },
            strong: {
              color: '#F0F4F8',
              fontWeight: '600',
            },
            code: {
              color: '#FF6B6B',
              backgroundColor: '#1A1F2C',
              padding: '0.2em 0.4em',
              borderRadius: '0.25em',
            },
            pre: {
              backgroundColor: '#1A1F2C',
              borderRadius: '0.5em',
              padding: '1em',
              overflowX: 'auto',
            },
          },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}; 
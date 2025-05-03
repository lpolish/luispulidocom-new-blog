/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#101114', // Almost pure black with subtle blue undertone
        primary: '#23262F',    // Graphite
        secondary: '#2C2F36',  // Slate
        accent: '#8CA0B6',     // Muted blue accent
        accent2: '#A3A380',    // Muted olive accent
        text: '#F4F4F9',       // Soft white text
        textMuted: '#A1A6B4',  // Misty gray
        highlight: '#23262F',  // Graphite highlight
        border: '#23262F',     // Graphite border
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#F4F4F9',
            maxWidth: '65ch',
            a: {
              color: '#8CA0B6',
              '&:hover': {
                color: '#A3A380',
                textDecoration: 'underline',
              },
            },
            h1: {
              color: '#F4F4F9',
              fontWeight: '700',
              letterSpacing: '-0.025em',
            },
            h2: {
              color: '#F4F4F9',
              fontWeight: '600',
              letterSpacing: '-0.025em',
            },
            h3: {
              color: '#F4F4F9',
              fontWeight: '600',
            },
            h4: {
              color: '#F4F4F9',
              fontWeight: '600',
            },
            blockquote: {
              color: '#A1A6B4',
              borderLeftColor: '#23262F',
              fontStyle: 'italic',
            },
            strong: {
              color: '#F4F4F9',
              fontWeight: '600',
            },
            code: {
              color: '#A3A380',
              backgroundColor: '#23262F',
              padding: '0.2em 0.4em',
              borderRadius: '0.25em',
            },
            pre: {
              backgroundColor: '#23262F',
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
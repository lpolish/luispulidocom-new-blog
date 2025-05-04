/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#23262F',
        secondary: '#2C2F36',
        accent: '#8CA0B6',
        accent2: '#A3A380',
        text: '#F4F4F9',
        textMuted: '#A1A6B4',
        background: '#121516',
        backgroundMuted: '#181A1B',
        border: '#2C2F36',
        syntax: {
          keyword: '#8CA0B6',
          string: '#A3A380',
          comment: '#A1A6B4',
          operator: '#F4F4F9',
          punctuation: '#F4F4F9',
          variable: '#F4F4F9',
        },
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
              fontSize: '0.875em',
            },
            'pre code': {
              backgroundColor: 'transparent !important',
              padding: '0',
              borderRadius: '0',
              color: '#F4F4F9',
              fontSize: '1em',
            },
            pre: {
              backgroundColor: '#000000',
              borderRadius: '0.5em',
              padding: '1.5em',
              overflowX: 'auto',
              fontSize: '0.875em',
              lineHeight: '1.7142857',
              marginTop: '1.7142857em',
              marginBottom: '1.7142857em',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'relative',
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
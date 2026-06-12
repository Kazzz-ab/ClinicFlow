/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: { DEFAULT: '#059669', light: '#34D399' },
        accent: '#14B8A6',
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.05)',
        'card-hover': '0 24px 48px rgba(5,150,105,0.18)',
      },
    },
  },
  plugins: [],
};

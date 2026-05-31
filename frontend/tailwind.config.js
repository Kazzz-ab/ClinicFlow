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
        primary: { DEFAULT: '#0077B6', light: '#00B4D8' },
        accent: '#06B6A0',
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.05)',
        'card-hover': '0 24px 48px rgba(0,119,182,0.18)',
      },
    },
  },
  plugins: [],
};

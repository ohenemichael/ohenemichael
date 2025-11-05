/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E8F5FF',
          100: '#D0EBFF',
          200: '#A1D7FF',
          300: '#72C3FF',
          400: '#43AFFF',
          500: '#149BFF',
          600: '#0D7ACC',
          700: '#0A5999',
          800: '#063866',
          900: '#031733',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
    },
  },
  plugins: [],
};

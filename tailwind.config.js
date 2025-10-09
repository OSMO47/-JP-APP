/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        sakura: '#f0dfc8',
        midnight: '#2f2623',
        moss: '#5f5a4b',
        sky: '#b14f37',
        parchment: '#f6f0df',
        gold: '#c3a168',
        indigo: '#2f4858'
      },
      fontFamily: {
        display: ['"Shippori Mincho"', 'serif'],
        body: ['"Noto Serif Thai"', '"Shippori Mincho"', 'serif']
      },
      boxShadow: {
        paper: '0 18px 40px rgba(47, 38, 35, 0.12)'
      }
    }
  },
  plugins: []
};

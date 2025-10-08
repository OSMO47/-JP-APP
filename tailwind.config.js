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
        sakura: '#f9e5e9',
        midnight: '#1f2937',
        moss: '#4b5563',
        sky: '#38bdf8'
      }
    }
  },
  plugins: []
};

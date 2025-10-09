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
        xpBlue: '#245edc',
        xpBlueLight: '#5f8ce9',
        xpNavy: '#1b3a73',
        xpGreen: '#3ba146',
        xpYellow: '#ffd863',
        xpPanel: '#f4f7ff',
        xpCream: '#e8f1ff',
        xpGray: '#c6d7f5',
        xpText: '#1e2d4a'
      },
      fontFamily: {
        display: ['"Trebuchet MS"', '"Noto Sans JP"', '"Noto Sans Thai"', 'sans-serif'],
        body: ['"Tahoma"', '"Noto Sans JP"', '"Noto Sans Thai"', 'sans-serif']
      },
      boxShadow: {
        window: '0 16px 32px rgba(36, 94, 220, 0.18)',
        toolbar: 'inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(27,58,115,0.2)'
      }
    }
  },
  plugins: []
};

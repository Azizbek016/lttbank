/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        kdb: {
          navy: '#1a2b4a',
          blue: '#2c5282',
          gold: '#c9a227',
        },
      },
      fontFamily: {
        statement: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

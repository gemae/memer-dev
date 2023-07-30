/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'yellow': '#fdca40',
        'yellow-10': '#ffd461',
        'black': '#080708',
        'white-10': '#e6e8e6',
        'gray': '#929292',
        'gray-10': '#f4f4f4',
      },
      spacing: {
        'container': '1280px'
      },
      fontFamily: {
        'sans' : ['Red Hat Text', 'sans-serif'],
        'serif' : ['Jomhuria', 'cursive']
      }
    }
  },
  plugins: [],
}
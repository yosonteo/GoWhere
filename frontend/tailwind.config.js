/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        'custom-yellow': '#ffde59',
        'custom-orange': '#ff914d',
      },
      backgroundImage: {
        'gradient-custom': 'linear-gradient(90deg, #ffde59, #ff914d)',
      },
    },
  },
  plugins: [],
}
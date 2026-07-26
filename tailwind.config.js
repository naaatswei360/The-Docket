/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        docket: {
          navy: '#0b1220',
          navy2: '#101a30',
          gold: '#c9a24b',
          gold2: '#e2c377',
        },
      },
      keyframes: {
        sway: {
          '0%, 100%': { transform: 'rotate(-1.5deg) translateY(0px)' },
          '50%': { transform: 'rotate(1.5deg) translateY(-2px)' },
        },
      },
      animation: {
        sway: 'sway 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

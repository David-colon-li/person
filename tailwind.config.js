/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Instrument Serif"', "serif"],
        sans: ["Inter", "sans-serif"],
      },
      letterSpacing: {
        'tight-heading': '-2.46px',
      },
      lineHeight: {
        'tight-heading': '0.95',
      },
      colors: {
        muted: '#6F6F6F',
      },
      animation: {
        'fade-rise': 'fade-rise 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
}

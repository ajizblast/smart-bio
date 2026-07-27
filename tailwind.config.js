/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      animation: {
        'wobble': 'wobble 1s ease-in-out infinite',
        'shake': 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both',
        'glow': 'glow 2s infinite alternate',
        'fade-in': 'fadeIn 0.25s ease-out forwards',
      },
      keyframes: {
        wobble: {
          '0%, 100%': { transform: 'translateX(0%) rotate(0deg)' },
          '15%': { transform: 'translateX(-5%) rotate(-5deg)' },
          '30%': { transform: 'translateX(3%) rotate(3deg)' },
          '45%': { transform: 'translateX(-3%) rotate(-3deg)' },
          '60%': { transform: 'translateX(2%) rotate(2deg)' },
          '75%': { transform: 'translateX(-1%) rotate(-1deg)' },
        },
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(99, 102, 241, 0.4), 0 0 10px rgba(99, 102, 241, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.8), 0 0 30px rgba(99, 102, 241, 0.4)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [],
}

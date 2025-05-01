/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#121212",
        primary: "#4285F4",
        'brand': {
          'emerald': '#006E51',
          'emerald-light': '#008C68',
          'emerald-dark': '#00513C',
          'gold': '#FFD700',
          'gold-light': '#FFEB99',
          'gold-dark': '#B39700'
        }
      },
      boxShadow: {
        glow: "0 0 20px rgba(255, 255, 255, 0.2)",
        'emerald-glow': "0 0 15px rgba(0, 110, 81, 0.5)",
        'gold-glow': "0 0 15px rgba(255, 215, 0, 0.5)",
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-in forwards',
        'slide-in': 'slideIn 0.5s ease-out forwards',
        'fade-up': 'fadeUp 0.5s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
      },
      blur: {
        '2xl': '40px',
      },
      transitionDuration: {
        '2000': '2000ms',
      },
    },
  },
  plugins: [],
}

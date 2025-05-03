/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Airbnb-inspired color palette
        'airbnb': {
          'rausch': '#FF5A5F',     // Primary red/coral
          'babu': '#00A699',       // Teal
          'arches': '#FC642D',     // Orange
          'hof': '#484848',        // Text gray
          'foggy': '#767676',      // Secondary text
        },
        // Background colors
        'background': {
          'primary': '#FFFFFF',    // Pure white
          'secondary': '#F7F7F7',  // Light gray
          'tertiary': '#F5F5F5',   // Slightly darker gray
        },
        // Text colors with accessible contrast ratios
        'text': {
          'primary': '#484848',    // Dark gray - passes 7:1 contrast on white
          'secondary': '#717171',  // Medium gray - passes 4.5:1 on white
          'tertiary': '#999999',   // Light gray - passes 3:1 on white
          'inverse': '#FFFFFF',    // White text for dark backgrounds
        },
        // Call to action colors
        'cta': {
          'primary': '#FF5A5F',    // Airbnb red
          'secondary': '#00A699',  // Teal
          'hover': '#FF7E82',      // Lighter red for hover states
          'active': '#E00007',     // Darker red for active states
          'disabled': '#FFD1D3',   // Very light red for disabled states
        },
        // Status colors for feedback
        'status': {
          'success': '#00A699',    // Teal
          'error': '#FF5A5F',      // Red
          'warning': '#FFB400',    // Amber
          'info': '#007A87',       // Dark teal
        },
        // Border colors
        'border': {
          'light': '#EBEBEB',      // Very light gray
          'default': '#DDDDDD',    // Light gray
          'dark': '#B0B0B0',       // Medium gray
        }
      },
      // Shadow system with reduced opacity for subtle effects
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.04)',
        'lg': '0 10px 15px rgba(0, 0, 0, 0.04), 0 4px 6px rgba(0, 0, 0, 0.02)',
        'xl': '0 20px 25px rgba(0, 0, 0, 0.03), 0 10px 10px rgba(0, 0, 0, 0.02)',
        'focus': '0 0 0 2px rgba(255, 90, 95, 0.3)',  // Accessible focus ring
        'hover': '0 2px 5px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fadeIn': 'fadeIn 0.2s ease-in-out',
        'slideIn': 'slideIn 0.3s ease-out',
        'bounce': 'bounce 1s infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounce: {
          '0%, 100%': { 
            transform: 'translateY(-5%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
          },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
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
      // Typography system optimized for readability and accessibility
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],               // 12px, accessible for non-critical info
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],           // 14px
        'base': ['1rem', { lineHeight: '1.5rem' }],              // 16px, main body text
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],           // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],            // 20px, subheadings
        '2xl': ['1.5rem', { lineHeight: '2rem' }],               // 24px, headings
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],          // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],            // 36px, page titles
        '5xl': ['3rem', { lineHeight: '1.16' }],                 // 48px, hero titles
      },
      
      // Enhanced spacing system
      spacing: {
        '0': '0',
        'px': '1px',
        '0.5': '0.125rem',
        '1': '0.25rem',
        '1.5': '0.375rem',
        '2': '0.5rem',
        '2.5': '0.625rem',
        '3': '0.75rem',
        '3.5': '0.875rem',
        '4': '1rem',         // 16px, base spacing unit
        '5': '1.25rem',
        '6': '1.5rem',
        '7': '1.75rem',
        '8': '2rem',         // 32px, section spacing
        '9': '2.25rem',
        '10': '2.5rem',
        '11': '2.75rem',
        '12': '3rem',        // 48px, large spacing
        '14': '3.5rem',
        '16': '4rem',        // 64px, container padding
        '20': '5rem',
        '24': '6rem',
        '28': '7rem',
        '32': '8rem',
        '36': '9rem',
        '40': '10rem',
        '44': '11rem',
        '48': '12rem',
        '52': '13rem',
        '56': '14rem',
        '60': '15rem',
        '64': '16rem',
        '72': '18rem',
        '80': '20rem',
        '96': '24rem',
        '128': '32rem',
      },
      
      // Improved z-index scale
      zIndex: {
        'behind': '-1',
        'auto': 'auto',
        '0': '0',
        '10': '10',       // Base elements
        '20': '20',       // Dropdown menus
        '30': '30',       // Fixed elements
        '40': '40',       // Sticky header
        '50': '50',       // Modals and dialogs
        '60': '60',       // Tooltips
        '70': '70',       // Global notifications
        '1000': '1000',   // Maximum z-index
      },

      // Border radius system
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',     // 2px
        'DEFAULT': '0.25rem', // 4px
        'md': '0.375rem',     // 6px
        'lg': '0.5rem',       // 8px
        'xl': '0.75rem',      // 12px
        '2xl': '1rem',        // 16px
        '3xl': '1.5rem',      // 24px
        'full': '9999px',     // Circular
      },
      
      // Animation system with reduced motion alternatives
      animation: {
        // Standard animations
        'fade-in': 'fadeIn 300ms ease-out forwards',
        'fade-out': 'fadeOut 200ms ease-in forwards',
        'slide-in': 'slideIn 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-out': 'slideOut 200ms ease-in forwards',
        'fade-up': 'fadeUp 400ms ease-out forwards',
        'fade-down': 'fadeDown 300ms ease-out forwards',
        'scale-in': 'scaleIn 200ms ease-out forwards',
        'scale-out': 'scaleOut 150ms ease-in forwards',
        'pop': 'pop 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'spin': 'spin 1s linear infinite',
        'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        
        // Subtle animations for UI elements
        'hover-lift': 'hoverLift 200ms ease-out forwards',
        'hover-drop': 'hoverDrop 200ms ease-out forwards',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
        'bounce-subtle': 'bounceSubtle 2s infinite',
        
        // Reduced motion alternatives (subtler animations)
        'reduced-fade': 'fadeIn 500ms linear forwards',
        'reduced-slide': 'reducedSlide 400ms linear forwards',
      },
      
      // Keyframes for animations
      keyframes: {
        // Standard animation keyframes
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideOut: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(10px)', opacity: '0' },
        },
        fadeUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
        pop: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '40%': { transform: 'scale(1.02)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        ping: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '75%, 100%': { transform: 'scale(2)', opacity: '0' },
        },
        
        // Subtle animation keyframes
        hoverLift: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-2px)' },
        },
        hoverDrop: {
          '0%': { transform: 'translateY(-2px)' },
          '100%': { transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        bounceSubtle: {
          '0%, 100%': { 
            transform: 'translateY(-2px)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
          },
        },
        
        // Reduced motion alternatives
        reducedSlide: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [
    // Plugin for generating aspect ratio classes
    function({ addUtilities }) {
      const newUtilities = {
        '.aspect-ratio-square': {
          aspectRatio: '1 / 1',
        },
        '.aspect-ratio-video': {
          aspectRatio: '16 / 9',
        },
        '.aspect-ratio-portrait': {
          aspectRatio: '3 / 4',
        },
        '.aspect-ratio-landscape': {
          aspectRatio: '4 / 3',
        },
        '.aspect-ratio-wide': {
          aspectRatio: '21 / 9',
        },
      };
      addUtilities(newUtilities);
    },
    
    // Plugin for focus-visible utility (progressive enhancement)
    function({ addVariant, e }) {
      addVariant('focus-visible', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`focus-visible${separator}${className}`)}:focus-visible`;
        });
      });
    },
    
    // Plugin for screen reader utilities
    function({ addUtilities }) {
      const newUtilities = {
        '.sr-only': {
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          borderWidth: '0',
        },
        '.not-sr-only': {
          position: 'static',
          width: 'auto',
          height: 'auto',
          padding: '0',
          margin: '0',
          overflow: 'visible',
          clip: 'auto',
          whiteSpace: 'normal',
        },
      };
      addUtilities(newUtilities);
    },
    
    // Plugin for reduced-motion preference
    function({ addVariant }) {
      addVariant('prefers-reduced-motion', ['@media (prefers-reduced-motion: reduce)']);
    },
    
    // Plugin for high contrast mode
    function({ addVariant }) {
      addVariant('forced-colors', ['@media (forced-colors: active)']);
      addVariant('high-contrast', ['@media (-ms-high-contrast: active)']);
    },
  ],
}
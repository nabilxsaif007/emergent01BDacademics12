import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Airbnb-inspired Button component with enhanced accessibility
 * 
 * @example
 * // Primary button
 * <Button variant="primary">Book Now</Button>
 * 
 * // Secondary button
 * <Button variant="secondary">See All Options</Button>
 * 
 * // With left icon
 * <Button icon={<SearchIcon />}>Search</Button>
 * 
 * // With loading state
 * <Button isLoading>Processing</Button>
 */
const Button = forwardRef(({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  fullWidth = false,
  isLoading = false,
  icon = null,
  iconPosition = 'left',
  className = '',
  ariaLabel,
  ariaDescribedby,
  ariaExpanded,
  ariaControls,
  ariaPressed,
  ...props 
}, ref) => {
  // Base classes with focus styles
  const baseClasses = `
    inline-flex items-center justify-center font-medium
    transition-all duration-300
    border border-transparent
    focus:outline-none focus:ring-2 focus:ring-offset-2
    select-none
    hover:transform hover:-translate-y-0.5 hover:shadow-md
  `;
  
  // Button variants following Airbnb style
  const variantClasses = {
    primary: `
      bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600
      text-white
      shadow-sm hover:shadow
      focus-visible:ring-green-500 focus-visible:ring-opacity-50
    `,
    secondary: `
      bg-green-500 hover:bg-green-600
      text-white
      shadow-sm hover:shadow
      focus-visible:ring-green-500 focus-visible:ring-opacity-50
    `,
    outline: `
      bg-white hover:bg-green-50
      text-gray-700 hover:text-green-600
      border border-gray-300 hover:border-green-300
      focus-visible:ring-green-500 focus-visible:ring-opacity-40
    `,
    subtle: `
      bg-transparent hover:bg-green-50
      text-gray-700 hover:text-green-600
      border border-transparent
      focus-visible:ring-green-400
    `,
    danger: `
      bg-status-error hover:bg-red-600
      text-white
      shadow-sm hover:shadow
      focus-visible:ring-red-500 focus-visible:ring-opacity-50
    `,
    link: `
      bg-transparent
      text-coral-500 hover:text-coral-600 active:text-coral-700
      underline hover:no-underline
      p-0 shadow-none
      focus-visible:ring-coral-500 focus-visible:ring-opacity-30
    `,
  };
  
  // Size classes with better touch targets for mobile
  const sizeClasses = {
    xs: 'px-2.5 py-1 text-xs rounded-lg',
    sm: 'px-3.5 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-5 py-2.5 text-base rounded-lg',
    xl: 'px-6 py-3 text-lg rounded-lg',
  };
  
  // State classes
  const stateClasses = {
    // Disabled state
    disabled: 'opacity-50 cursor-not-allowed bg-opacity-80 pointer-events-none',
    // Loading state 
    loading: 'relative !text-transparent pointer-events-none',
    // Normal interactive state with hover effect
    normal: 'transform hover:translate-y-[-1px] active:translate-y-[0px]',
  };
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Figure out which state to apply
  const currentState = isLoading ? 'loading' : disabled ? 'disabled' : 'normal';
  
  // Icon spacing
  const iconSpacing = children ? (iconPosition === 'left' ? 'mr-2' : 'ml-2') : '';
  
  // Accessibility attributes
  const a11yProps = {
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedby,
    'aria-expanded': ariaExpanded,
    'aria-controls': ariaControls,
    'aria-pressed': ariaPressed,
    'aria-busy': isLoading || undefined,
    'aria-disabled': disabled || undefined,
  };
  
  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${stateClasses[currentState]} ${className}`}
      {...a11yProps}
      {...props}
    >
      {/* Show loading spinner when isLoading is true */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg 
            className="animate-spin w-5 h-5 text-current" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle 
              className="opacity-25" 
              cx="12" cy="12" r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}
      
      {/* Left icon */}
      {icon && iconPosition === 'left' && (
        <span className={`${iconSpacing} flex-shrink-0`} aria-hidden="true">{icon}</span>
      )}
      
      {/* Button text */}
      <span className="flex-1 truncate">
        {children}
      </span>
      
      {/* Right icon */}
      {icon && iconPosition === 'right' && (
        <span className={`${iconSpacing} flex-shrink-0`} aria-hidden="true">{icon}</span>
      )}
    </button>
  );
});

Button.propTypes = {
  /** Button content */
  children: PropTypes.node,
  /** Click handler function */
  onClick: PropTypes.func,
  /** HTML button type */
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  /** Button visual style */
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'subtle', 'danger', 'link', 'black', 'white']),
  /** Button size */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Whether the button is disabled */
  disabled: PropTypes.bool,
  /** Whether the button should take full width of container */
  fullWidth: PropTypes.bool,
  /** Whether to show a loading spinner */
  isLoading: PropTypes.bool,
  /** Optional icon element */
  icon: PropTypes.node,
  /** Icon position relative to text */
  iconPosition: PropTypes.oneOf(['left', 'right']),
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Accessible label for screen readers */
  ariaLabel: PropTypes.string,
  /** ID of element that describes this button */
  ariaDescribedby: PropTypes.string,
  /** Whether button controls an expanded element */
  ariaExpanded: PropTypes.bool,
  /** ID of element controlled by this button */
  ariaControls: PropTypes.string,
  /** Whether button is in a pressed state */
  ariaPressed: PropTypes.bool,
};

// Display name for dev tools
Button.displayName = 'Button';

export default Button;
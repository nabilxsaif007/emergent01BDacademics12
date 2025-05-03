import React from 'react';
import PropTypes from 'prop-types';

/**
 * Accessible loading component with multiple variants
 * 
 * @example
 * // Default spinner
 * <Loading />
 * 
 * // Different sizes
 * <Loading size="sm" />
 * <Loading size="lg" />
 * 
 * // Different variants
 * <Loading variant="dots" />
 * <Loading variant="skeleton" width="100%" height="24px" />
 * 
 * // With accessible label
 * <Loading ariaLabel="Loading user data" />
 */
const Loading = ({
  variant = 'spinner',
  size = 'md',
  color = 'primary',
  overlay = false,
  fullPage = false,
  ariaLabel = 'Loading',
  className = '',
  width,
  height,
  ...props
}) => {
  // Size classes mapping for different variants
  const sizeClasses = {
    spinner: {
      xs: 'h-4 w-4',
      sm: 'h-6 w-6',
      md: 'h-8 w-8',
      lg: 'h-12 w-12',
      xl: 'h-16 w-16',
    },
    dots: {
      xs: 'h-4',
      sm: 'h-6',
      md: 'h-8',
      lg: 'h-12',
      xl: 'h-16',
    },
    skeleton: {
      xs: 'h-2',
      sm: 'h-4',
      md: 'h-6',
      lg: 'h-8',
      xl: 'h-12',
    },
  };

  // Color classes for different elements
  const colorClasses = {
    primary: 'text-cta-primary',
    secondary: 'text-cta-secondary',
    white: 'text-white',
    gray: 'text-text-tertiary',
  };

  // Wrapper classes for overlay or fullpage modes
  const wrapperClasses = (() => {
    if (fullPage) {
      return 'fixed inset-0 flex items-center justify-center z-50 bg-background-primary bg-opacity-80';
    }
    if (overlay) {
      return 'absolute inset-0 flex items-center justify-center z-10 bg-background-primary bg-opacity-80';
    }
    return 'inline-flex';
  })();

  // Skeleton specific styles
  const skeletonStyles = variant === 'skeleton' ? {
    width: width || '100%',
    height: height || (sizeClasses.skeleton[size].replace('h-', '') + 'rem'),
  } : {};

  // Render spinner loading
  if (variant === 'spinner') {
    return (
      <div className={`${wrapperClasses} ${className}`} role="status" aria-live="polite" {...props}>
        <svg
          className={`animate-spin ${sizeClasses.spinner[size]} ${colorClasses[color]}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span className="sr-only">{ariaLabel}</span>
      </div>
    );
  }

  // Render dots loading
  if (variant === 'dots') {
    return (
      <div className={`${wrapperClasses} ${className}`} role="status" aria-live="polite" {...props}>
        <div className={`flex space-x-1 ${sizeClasses.dots[size]}`}>
          <div className={`${colorClasses[color]} animate-bounce delay-0 rounded-full ${sizeClasses.dots[size]}`} style={{ width: sizeClasses.dots[size].replace('h-', '') + 'rem', animationDelay: '0ms' }}></div>
          <div className={`${colorClasses[color]} animate-bounce delay-100 rounded-full ${sizeClasses.dots[size]}`} style={{ width: sizeClasses.dots[size].replace('h-', '') + 'rem', animationDelay: '100ms' }}></div>
          <div className={`${colorClasses[color]} animate-bounce delay-200 rounded-full ${sizeClasses.dots[size]}`} style={{ width: sizeClasses.dots[size].replace('h-', '') + 'rem', animationDelay: '200ms' }}></div>
        </div>
        <span className="sr-only">{ariaLabel}</span>
      </div>
    );
  }

  // Render skeleton loading
  if (variant === 'skeleton') {
    return (
      <div
        className={`animate-pulse rounded bg-border-light ${className}`}
        style={skeletonStyles}
        role="status"
        aria-live="polite"
        {...props}
      >
        <span className="sr-only">{ariaLabel}</span>
      </div>
    );
  }

  return null;
};

Loading.propTypes = {
  /** Loading indicator type */
  variant: PropTypes.oneOf(['spinner', 'dots', 'skeleton']),
  /** Size of loading indicator */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Color of loading indicator */
  color: PropTypes.oneOf(['primary', 'secondary', 'white', 'gray']),
  /** Whether to show as overlay on parent element */
  overlay: PropTypes.bool,
  /** Whether to display full page loading overlay */
  fullPage: PropTypes.bool,
  /** Accessible label for screen readers */
  ariaLabel: PropTypes.string,
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Width for skeleton variant */
  width: PropTypes.string,
  /** Height for skeleton variant */
  height: PropTypes.string,
};

export default Loading;
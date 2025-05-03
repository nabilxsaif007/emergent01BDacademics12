import React from 'react';
import PropTypes from 'prop-types';

/**
 * Airbnb-inspired Badge component for displaying status indicators, counters, and labels
 * 
 * @example
 * // Default badge
 * <Badge>New</Badge>
 * 
 * // Status badge
 * <Badge variant="success">Verified</Badge>
 * 
 * // Count badge
 * <Badge variant="primary" rounded>3</Badge>
 * 
 * // Dot indicator
 * <Badge dot variant="error" />
 */
const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  rounded = false,
  dot = false,
  outline = false,
  icon = null,
  className = '',
  ...props
}) => {
  // Base classes with proper focus handling
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors';
  
  // Variant classes based on Airbnb color palette
  const variantClasses = {
    default: outline 
      ? 'bg-transparent border border-border-default text-text-secondary' 
      : 'bg-background-tertiary text-text-secondary',
      
    primary: outline 
      ? 'bg-transparent border border-cta-primary text-cta-primary' 
      : 'bg-cta-primary text-white',
      
    secondary: outline 
      ? 'bg-transparent border border-cta-secondary text-cta-secondary' 
      : 'bg-cta-secondary text-white',
      
    success: outline 
      ? 'bg-transparent border border-status-success text-status-success' 
      : 'bg-status-success text-white',
      
    error: outline 
      ? 'bg-transparent border border-status-error text-status-error' 
      : 'bg-status-error text-white',
      
    warning: outline 
      ? 'bg-transparent border border-status-warning text-status-warning' 
      : 'bg-status-warning text-white',
      
    info: outline 
      ? 'bg-transparent border border-status-info text-status-info' 
      : 'bg-status-info text-white',
  };
  
  // Size classes with good touch targets and proper spacing
  const sizeClasses = {
    xs: dot 
      ? 'h-1.5 w-1.5' 
      : rounded 
        ? 'h-4 w-4 text-[10px]' 
        : 'h-4 px-1 text-[10px]',
        
    sm: dot 
      ? 'h-2 w-2' 
      : rounded 
        ? 'h-5 w-5 text-xs' 
        : 'h-5 px-1.5 text-xs',
        
    md: dot 
      ? 'h-2.5 w-2.5' 
      : rounded 
        ? 'h-6 w-6 text-sm' 
        : 'h-6 px-2 text-sm',
        
    lg: dot 
      ? 'h-3 w-3' 
      : rounded 
        ? 'h-7 w-7 text-base' 
        : 'h-7 px-2.5 text-base',
  };
  
  // Border radius based on shape
  const radiusClasses = rounded ? 'rounded-full' : 'rounded';
  
  return (
    <span 
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${sizeClasses[size]} 
        ${radiusClasses} 
        ${className}
      `}
      role={dot ? 'status' : (variant === 'error' || variant === 'warning') ? 'status' : undefined}
      aria-label={dot ? props['aria-label'] || `${variant} indicator` : undefined}
      {...props}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {!dot && children}
    </span>
  );
};

Badge.propTypes = {
  /** Badge content */
  children: PropTypes.node,
  /** Badge visual style */
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'success', 'error', 'warning', 'info']),
  /** Badge size */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
  /** Whether badge should be fully rounded (circular) */
  rounded: PropTypes.bool,
  /** Whether badge should be a dot indicator (no content) */
  dot: PropTypes.bool,
  /** Whether badge should have outline style */
  outline: PropTypes.bool,
  /** Optional icon element */
  icon: PropTypes.node,
  /** Additional CSS classes */
  className: PropTypes.string,
};

export default Badge;
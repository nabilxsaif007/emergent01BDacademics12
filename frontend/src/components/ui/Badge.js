import React from 'react';
import PropTypes from 'prop-types';

/**
 * Badge component for status indicators and tags
 */
const Badge = ({ 
  children, 
  variant = 'default',
  size = 'md',
  pill = false,
  className = '',
  onClick = null,
  ...props 
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center font-medium';
  
  // Variant classes
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-brand-emerald text-white',
    secondary: 'bg-brand-gold text-gray-900',
    emerald: 'bg-green-100 text-green-800',
    gold: 'bg-yellow-100 text-yellow-800',
    blue: 'bg-blue-100 text-blue-800',
    red: 'bg-red-100 text-red-800',
    purple: 'bg-purple-100 text-purple-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
  };
  
  // Shape classes
  const shapeClasses = pill ? 'rounded-full' : 'rounded';
  
  // Interactive classes
  const interactiveClasses = onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : '';
  
  return (
    <span
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${shapeClasses} ${interactiveClasses} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    'default', 'primary', 'secondary', 'emerald', 'gold', 
    'blue', 'red', 'purple', 'success', 'warning', 'danger', 'info'
  ]),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  pill: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default Badge;
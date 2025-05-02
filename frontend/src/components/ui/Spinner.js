import React from 'react';
import PropTypes from 'prop-types';

/**
 * Spinner component for loading states
 */
const Spinner = ({ 
  size = 'md', 
  variant = 'emerald',
  label = 'Loading...',
  className = ''
}) => {
  // Size classes
  const sizeMap = {
    xs: 'h-4 w-4 border-2',
    sm: 'h-6 w-6 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4'
  };
  
  // Color variants
  const variantMap = {
    emerald: 'border-brand-emerald/30 border-t-brand-emerald',
    gold: 'border-brand-gold/30 border-t-brand-gold',
    white: 'border-white/30 border-t-white',
    gray: 'border-gray-300/30 border-t-gray-300'
  };
  
  return (
    <div className="flex flex-col items-center justify-center" role="status">
      <div 
        className={`rounded-full animate-spin ${sizeMap[size]} ${variantMap[variant]} ${className}`}
        aria-hidden="true"
      ></div>
      {label && (
        <span className="sr-only">{label}</span>
      )}
    </div>
  );
};

Spinner.propTypes = {
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  variant: PropTypes.oneOf(['emerald', 'gold', 'white', 'gray']),
  label: PropTypes.string,
  className: PropTypes.string
};

export default Spinner;
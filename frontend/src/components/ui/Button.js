import React from 'react';
import PropTypes from 'prop-types';

/**
 * Button component with multiple variants
 */
const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  fullWidth = false,
  icon = null,
  iconPosition = 'left',
  className = '',
  ariaLabel,
  ...props 
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm';
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-brand-emerald hover:bg-brand-emerald-light text-white focus:ring-brand-emerald-light',
    secondary: 'bg-brand-gold hover:bg-brand-gold-light text-white focus:ring-brand-gold-light',
    outline: 'border-2 border-brand-emerald text-brand-emerald hover:bg-opacity-10 hover:bg-brand-emerald focus:ring-brand-emerald',
    ghost: 'bg-transparent hover:bg-gray-100 text-text-secondary hover:text-text-primary',
    danger: 'bg-red-600 hover:bg-red-500 text-white focus:ring-red-400',
    link: 'bg-transparent shadow-none underline text-brand-emerald hover:text-brand-emerald-light p-0 hover:no-underline',
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'py-1.5 px-3 text-sm rounded-md',
    md: 'py-2 px-4 text-base rounded-md',
    lg: 'py-2.5 px-5 text-lg rounded-lg',
  };
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Disabled classes
  const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed' : 'transform hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm';
  
  // Icon spacing
  const iconSpacing = children ? (iconPosition === 'left' ? 'mr-2' : 'ml-2') : '';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${disabledClasses} ${className}`}
      aria-label={ariaLabel || null}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className={iconSpacing}>{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className={iconSpacing}>{icon}</span>
      )}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'danger', 'link']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
};

export default Button;
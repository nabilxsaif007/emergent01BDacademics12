import React from 'react';
import PropTypes from 'prop-types';

/**
 * Card component for consistent content containers
 */
const Card = ({ 
  children, 
  variant = 'default',
  hover = false,
  className = '',
  ...props 
}) => {
  // Base classes
  const baseClasses = 'rounded-lg overflow-hidden transition-all duration-300';
  
  // Variant classes
  const variantClasses = {
    default: 'bg-white border border-gray-200 shadow',
    outlined: 'bg-white border-2 border-gray-200',
    elevated: 'bg-white shadow-md',
    emerald: 'bg-white border-l-4 border-brand-emerald shadow',
    gold: 'bg-white border-l-4 border-brand-gold shadow',
    dark: 'bg-gray-800 text-white shadow-md',
  };
  
  // Hover effect
  const hoverClasses = hover ? 'transform hover:-translate-y-1 hover:shadow-lg' : '';
  
  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Card Header component
const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`} {...props}>
      {children}
    </div>
  );
};

// Card Body component
const CardBody = ({ children, className = '', ...props }) => {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

// Card Footer component
const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 ${className}`} {...props}>
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'outlined', 'elevated', 'emerald', 'gold', 'dark']),
  hover: PropTypes.bool,
  className: PropTypes.string,
};

CardHeader.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

CardBody.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

CardFooter.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Card;
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Airbnb-inspired Card component for displaying content in containers
 * 
 * @example
 * // Basic card
 * <Card>
 *   <Card.Body>Content goes here</Card.Body>
 * </Card>
 * 
 * // Card with header and footer
 * <Card>
 *   <Card.Header>
 *     <h3>Card Title</h3>
 *   </Card.Header>
 *   <Card.Body>Main content</Card.Body>
 *   <Card.Footer>Footer actions</Card.Footer>
 * </Card>
 */
const Card = forwardRef(({ 
  children, 
  variant = 'default',
  padding = true,
  hover = false,
  interactive = false,
  highlighted = false,
  as = 'div',
  onClick,
  className = '',
  ...props 
}, ref) => {
  // Base classes with smooth transitions and rounded corners
  const baseClasses = `
    rounded-lg overflow-hidden
    transition-all duration-200
  `;
  
  // Card variant styles following Airbnb design principles
  const variantClasses = {
    default: `
      bg-background-primary
      border border-border-light
      shadow-sm
    `,
    outlined: `
      bg-background-primary
      border-2 border-border-default
    `,
    elevated: `
      bg-background-primary
      shadow-md
    `,
    feature: `
      bg-background-primary
      border border-border-light
      shadow-md
    `,
    accent: `
      bg-background-primary
      border-l-4 border-cta-primary
      shadow-sm
    `,
    secondary: `
      bg-background-primary
      border-l-4 border-cta-secondary
      shadow-sm
    `,
    subtle: `
      bg-background-secondary
      border border-transparent
    `,
  };
  
  // Conditional classes
  const paddingClass = padding ? '' : 'p-0';
  const hoverClasses = hover ? 'transform hover:-translate-y-1 hover:shadow-lg' : '';
  const interactiveClasses = interactive ? 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cta-primary focus-visible:ring-opacity-50' : '';
  const highlightedClasses = highlighted ? 'ring-2 ring-cta-primary ring-opacity-50' : '';
  
  // Props for interactive card
  const interactiveProps = interactive ? {
    tabIndex: 0,
    role: 'button',
    onClick,
    onKeyDown: (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick && onClick(e);
      }
    }
  } : {};
  
  // Create the component using the specified HTML element
  const Component = as;
  
  return (
    <Component
      ref={ref}
      className={`${baseClasses} ${variantClasses[variant]} ${paddingClass} ${hoverClasses} ${interactiveClasses} ${highlightedClasses} ${className}`}
      {...interactiveProps}
      {...props}
    >
      {children}
    </Component>
  );
});

// Card Header component
const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div className={`px-6 py-4 border-b border-gray-100 bg-gray-50 bg-opacity-50 ${className}`} {...props}>
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
    <div className={`px-6 py-4 border-t border-gray-100 bg-gray-50 bg-opacity-30 ${className}`} {...props}>
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
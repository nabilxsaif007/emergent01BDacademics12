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

/**
 * Card Header component - displays at the top of a card
 */
const CardHeader = forwardRef(({ children, className = '', divider = true, compact = false, ...props }, ref) => {
  // Base styles for card header
  const baseClasses = `
    border-b ${divider ? 'border-border-light' : 'border-transparent'}
    ${compact ? 'px-4 py-3' : 'px-6 py-4'}
    bg-background-secondary bg-opacity-40
    flex flex-wrap items-center justify-between
  `;
  
  return (
    <div ref={ref} className={`${baseClasses} ${className}`} {...props}>
      {children}
    </div>
  );
});

/**
 * Card Body component - contains the main content of a card
 */
const CardBody = forwardRef(({ children, className = '', compact = false, ...props }, ref) => {
  // Base styles for card body
  const baseClasses = `${compact ? 'p-4' : 'p-6'}`;
  
  return (
    <div ref={ref} className={`${baseClasses} ${className}`} {...props}>
      {children}
    </div>
  );
});

/**
 * Card Footer component - displays at the bottom of a card
 */
const CardFooter = forwardRef(({ children, className = '', divider = true, compact = false, ...props }, ref) => {
  // Base styles for card footer
  const baseClasses = `
    border-t ${divider ? 'border-border-light' : 'border-transparent'}
    ${compact ? 'px-4 py-3' : 'px-6 py-4'}
    bg-background-secondary bg-opacity-30
    flex flex-wrap items-center justify-between
  `;
  
  return (
    <div ref={ref} className={`${baseClasses} ${className}`} {...props}>
      {children}
    </div>
  );
});

// Card Image component for consistent card image handling
const CardImage = forwardRef(({ src, alt, aspectRatio = 'auto', position = 'center', className = '', ...props }, ref) => {
  // Aspect ratio class mapping
  const aspectRatioClasses = {
    'auto': '',
    'square': 'aspect-ratio-square',
    'video': 'aspect-ratio-video',
    'portrait': 'aspect-ratio-portrait',
    'landscape': 'aspect-ratio-landscape',
  };
  
  // Object position classes
  const positionClasses = {
    'center': 'object-center',
    'top': 'object-top',
    'bottom': 'object-bottom',
    'left': 'object-left',
    'right': 'object-right',
  };
  
  // Base styles for card image
  const baseClasses = `
    w-full h-full object-cover 
    ${aspectRatioClasses[aspectRatio]} 
    ${positionClasses[position]}
  `;
  
  return (
    <div className="w-full overflow-hidden">
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={`${baseClasses} ${className}`}
        {...props}
      />
    </div>
  );
});

// Attach subcomponents to Card
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Image = CardImage;

// PropTypes for Card
Card.propTypes = {
  /** Content inside the card */
  children: PropTypes.node.isRequired,
  /** Visual style variant */
  variant: PropTypes.oneOf(['default', 'outlined', 'elevated', 'feature', 'accent', 'secondary', 'subtle']),
  /** Whether to apply default padding (can be disabled for custom layouts) */
  padding: PropTypes.bool,
  /** Whether to apply hover effects */
  hover: PropTypes.bool,
  /** Whether card is clickable */
  interactive: PropTypes.bool,
  /** Whether to display a highlight ring around the card */
  highlighted: PropTypes.bool,
  /** HTML element to use for the card */
  as: PropTypes.elementType,
  /** Click handler (only used if interactive is true) */
  onClick: PropTypes.func,
  /** Additional CSS classes */
  className: PropTypes.string,
};

// PropTypes for CardHeader
CardHeader.propTypes = {
  /** Content inside the header */
  children: PropTypes.node.isRequired,
  /** Whether to show a divider line */
  divider: PropTypes.bool,
  /** Whether to use a more compact layout */
  compact: PropTypes.bool,
  /** Additional CSS classes */
  className: PropTypes.string,
};

// PropTypes for CardBody
CardBody.propTypes = {
  /** Content inside the body */
  children: PropTypes.node.isRequired,
  /** Whether to use a more compact layout */
  compact: PropTypes.bool,
  /** Additional CSS classes */
  className: PropTypes.string,
};

// PropTypes for CardFooter
CardFooter.propTypes = {
  /** Content inside the footer */
  children: PropTypes.node.isRequired,
  /** Whether to show a divider line */
  divider: PropTypes.bool,
  /** Whether to use a more compact layout */
  compact: PropTypes.bool,
  /** Additional CSS classes */
  className: PropTypes.string,
};

// PropTypes for CardImage
CardImage.propTypes = {
  /** Image source URL */
  src: PropTypes.string.isRequired,
  /** Alternative text for accessibility */
  alt: PropTypes.string.isRequired,
  /** Aspect ratio of the image container */
  aspectRatio: PropTypes.oneOf(['auto', 'square', 'video', 'portrait', 'landscape']),
  /** Object position for image focal point */
  position: PropTypes.oneOf(['center', 'top', 'bottom', 'left', 'right']),
  /** Additional CSS classes */
  className: PropTypes.string,
};

// Display names for dev tools
Card.displayName = 'Card';
CardHeader.displayName = 'Card.Header';
CardBody.displayName = 'Card.Body';
CardFooter.displayName = 'Card.Footer';
CardImage.displayName = 'Card.Image';

export default Card;
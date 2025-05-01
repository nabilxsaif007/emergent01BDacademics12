import React from 'react';
import PropTypes from 'prop-types';

/**
 * AccessibleIcon wraps an icon with proper accessibility attributes
 * This ensures all icons have proper screen reader support
 */
const AccessibleIcon = ({ 
  children, 
  label, 
  ...props 
}) => {
  return (
    <span 
      role="img" 
      aria-label={label} 
      aria-hidden={!label}
      {...props}
    >
      {children}
    </span>
  );
};

AccessibleIcon.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
};

export default AccessibleIcon;
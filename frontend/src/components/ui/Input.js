import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Input component for form fields with consistent styling
 */
const Input = forwardRef(({ 
  id,
  name,
  type = 'text',
  placeholder = '',
  value = '',
  onChange,
  onBlur,
  disabled = false,
  readOnly = false,
  error = '',
  label = '',
  helpText = '',
  leftIcon = null,
  rightIcon = null,
  fullWidth = true,
  className = '',
  required = false,
  ...props 
}, ref) => {
  // Base classes
  const baseClasses = 'form-input border shadow-sm focus:ring-2 focus:ring-opacity-30 transition-all duration-200';
  
  // State classes
  const stateClasses = error
    ? 'border-red-300 focus:border-red-400 focus:ring-red-300 bg-red-50'
    : 'border-gray-200 focus:border-brand-emerald focus:ring-brand-emerald-light';
  
  // Size and shape classes
  const sizeClasses = 'py-2.5 px-4 rounded-md';
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Icon classes
  const leftIconClasses = leftIcon ? 'pl-10' : '';
  const rightIconClasses = rightIcon ? 'pr-10' : '';
  
  // Disabled classes
  const disabledClasses = disabled ? 'bg-gray-50 cursor-not-allowed opacity-75' : 'bg-white';
  
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label 
          htmlFor={id} 
          className="block mb-2 text-sm font-medium text-text-primary"
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-tertiary">
            {leftIcon}
          </div>
        )}
        
        <input
          id={id}
          ref={ref}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          className={`${baseClasses} ${stateClasses} ${sizeClasses} ${widthClasses} ${leftIconClasses} ${rightIconClasses} ${disabledClasses} ${className}`}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-tertiary">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-500 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      
      {helpText && !error && (
        <p className="mt-1.5 text-sm text-text-tertiary">{helpText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  error: PropTypes.string,
  label: PropTypes.node,
  helpText: PropTypes.node,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  required: PropTypes.bool,
};

export default Input;
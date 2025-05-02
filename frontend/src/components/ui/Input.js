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
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
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
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
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
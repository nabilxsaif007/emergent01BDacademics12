import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Airbnb-inspired Input component with enhanced accessibility and validation features
 * 
 * @example
 * // Basic input
 * <Input 
 *   id="email" 
 *   name="email" 
 *   label="Email Address" 
 *   type="email" 
 *   placeholder="Enter your email"
 *   required
 * />
 * 
 * // Input with validation and helper text
 * <Input 
 *   id="password" 
 *   name="password" 
 *   label="Password" 
 *   type="password"
 *   helpText="Password must be at least 8 characters"
 *   error={passwordError}
 *   showCount 
 *   maxLength={20}
 * />
 */
const Input = forwardRef(({ 
  id,
  name,
  type = 'text',
  placeholder = '',
  value = '',
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  readOnly = false,
  error = '',
  label = '',
  helpText = '',
  leftIcon = null,
  rightIcon = null,
  actionIcon = null,
  onActionClick,
  fullWidth = true,
  className = '',
  required = false,
  maxLength,
  showCount = false,
  autoComplete,
  size = 'md',
  labelSize = 'md',
  hasSuccessIndicator = false,
  inlineLabel = false,
  hideLabel = false, // For visually hidden but accessible labels
  ...props 
}, ref) => {
  // Local state
  const [isFocused, setIsFocused] = useState(false);
  const [valueLength, setValueLength] = useState(value?.toString()?.length || 0);
  
  // Generate a unique ID if none is provided
  const inputId = id || `input-${name}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Handle focus event
  const handleFocus = (e) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };
  
  // Handle blur event
  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };
  
  // Handle change event
  const handleChange = (e) => {
    setValueLength(e.target.value?.length || 0);
    if (onChange) onChange(e);
  };

  // Base input classes
  const baseClasses = `
    form-input
    border 
    transition-all duration-200
    focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-40
    w-full
    ${disabled ? 'bg-background-tertiary cursor-not-allowed opacity-75' : 'bg-background-primary'}
  `;
  
  // Input state classes
  const stateClasses = error
    ? 'border-status-error focus:border-status-error focus-visible:ring-status-error bg-status-error bg-opacity-5'
    : isFocused
      ? 'border-cta-primary focus:border-cta-primary focus-visible:ring-cta-primary'
      : hasSuccessIndicator && value && !error
        ? 'border-status-success focus:border-status-success focus-visible:ring-status-success'
        : 'border-border-default hover:border-border-dark focus:border-cta-primary focus-visible:ring-cta-primary';
  
  // Size classes
  const sizeClasses = {
    sm: 'py-1.5 px-3 text-sm rounded',
    md: 'py-2.5 px-4 text-base rounded-md',
    lg: 'py-3 px-5 text-lg rounded-md',
  };
  
  // Label size classes
  const labelSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };
  
  // Icon positioning classes
  const leftIconClasses = leftIcon ? 'pl-10' : '';
  const rightIconClasses = (rightIcon || (showCount && maxLength)) ? 'pr-10' : '';
  const actionIconClasses = actionIcon ? 'pr-10' : '';
  
  // Success indicator
  const successIndicator = hasSuccessIndicator && value && !error && (
    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-status-success">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    </div>
  );
  
  // Create a derived ID for the helper text to associate with input via aria-describedby
  const helpTextId = helpText ? `${inputId}-help` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const descriptionId = [helpTextId, errorId].filter(Boolean).join(' ') || undefined;
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${inlineLabel ? 'flex items-start' : ''}`}>
      {label && !hideLabel && (
        <label 
          htmlFor={inputId} 
          className={`
            ${inlineLabel ? `mr-4 pt-2.5 min-w-[120px] ${labelSizeClasses[labelSize]}` : `block mb-2 ${labelSizeClasses[labelSize]}`}
            font-medium text-text-primary
          `}
        >
          {label}
          {required && <span className="ml-1 text-status-error" aria-hidden="true">*</span>}
        </label>
      )}
      
      {/* Visually hidden label for screen readers if hideLabel is true */}
      {label && hideLabel && (
        <label 
          htmlFor={inputId} 
          className="sr-only"
        >
          {label}{required ? ' (required)' : ''}
        </label>
      )}
      
      <div className={`relative ${inlineLabel ? 'flex-1' : ''}`}>
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-tertiary" aria-hidden="true">
            {leftIcon}
          </div>
        )}
        
        <input
          id={inputId}
          ref={ref}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          maxLength={maxLength}
          autoComplete={autoComplete}
          className={`
            ${baseClasses} 
            ${stateClasses} 
            ${sizeClasses[size]} 
            ${leftIconClasses} 
            ${rightIconClasses} 
            ${actionIconClasses} 
            ${className}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={descriptionId}
          {...props}
        />
        
        {/* Success indicator or right icon */}
        {successIndicator || (rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-tertiary" aria-hidden="true">
            {rightIcon}
          </div>
        ))}
        
        {/* Character counter */}
        {showCount && maxLength && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-tertiary">
            <span className={`text-xs ${valueLength > maxLength ? 'text-status-error' : ''}`} aria-hidden="true">
              {valueLength}/{maxLength}
            </span>
          </div>
        )}
        
        {/* Clickable action icon */}
        {actionIcon && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-tertiary hover:text-text-secondary"
            onClick={onActionClick}
            tabIndex={-1} // Don't interfere with input tab order
            aria-label={props['aria-actionlabel'] || 'Input action'}
          >
            {actionIcon}
          </button>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <p id={errorId} className="mt-2 text-sm text-status-error flex items-start" role="alert">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </p>
      )}
      
      {/* Help text */}
      {helpText && !error && (
        <p id={helpTextId} className="mt-1.5 text-sm text-text-tertiary">
          {helpText}
        </p>
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
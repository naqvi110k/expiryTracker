import React, { useState } from 'react';

const Input = ({ 
  label, 
  error, 
  className = '', 
  id, 
  darkMode, 
  required = false,
  minLength,
  maxLength,
  pattern,
  validateOnBlur = true,
  validateOnChange = false,
  validator,
  helperText,
  ...props 
}) => {
  const inputId = id || props.name || Math.random().toString(36).substr(2, 9);
  const isDarkMode = darkMode !== undefined ? darkMode : (typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));
  
  const [validationError, setValidationError] = useState('');
  const [isValid, setIsValid] = useState(null);

  const handleValidation = (value) => {
    let errorMsg = '';
    
    if (validator && typeof validator === 'function') {
      const result = validator(value);
      if (result !== true) {
        errorMsg = typeof result === 'string' ? result : 'Invalid input';
      }
    }
    
    if (!errorMsg && required && !value) {
      errorMsg = `${label || 'Field'} is required`;
    }
    
    if (!errorMsg && minLength && value && value.length < minLength) {
      errorMsg = `Minimum length is ${minLength} characters`;
    }
    
    if (!errorMsg && maxLength && value && value.length > maxLength) {
      errorMsg = `Maximum length is ${maxLength} characters`;
    }
    
    if (!errorMsg && pattern && value && !new RegExp(pattern).test(value)) {
      errorMsg = 'Invalid format';
    }
    
    setValidationError(errorMsg);
    setIsValid(errorMsg ? false : value ? true : null);
    
    return !errorMsg;
  };
  
  const handleChange = (e) => {
    if (props.onChange) {
      props.onChange(e);
    }
    
    if (validateOnChange) {
      handleValidation(e.target.value);
    }
  };
  
  const handleBlur = (e) => {
    if (props.onBlur) {
      props.onBlur(e);
    }
    
    if (validateOnBlur) {
      handleValidation(e.target.value);
    }
  };

  const displayError = error || validationError;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label 
          htmlFor={inputId} 
          className={`block text-xs font-semibold tracking-tight ${isDarkMode ? 'text-[#A3A39E]' : 'text-[#4A4A46]'}`}
          aria-required={required}
        >
          {label}
          {required && <span className="text-[#DC2626] ml-1" aria-label="required">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`flex h-10 w-full rounded-lg border px-3.5 py-2 text-sm focus:outline-none transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${
          isDarkMode
            ? 'bg-[#0A0A0A] border-[#262626] text-[#F5F5F3] placeholder:text-[#6E6E68] focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/15'
            : 'bg-white border-[#CFCFC8] text-[#111111] placeholder:text-[#767670] focus:border-[#15803D] focus:ring-2 focus:ring-[#15803D]/15'
        } ${displayError ? 'border-red-500 focus:ring-red-500/20' : isValid === true ? 'border-emerald-600 focus:ring-emerald-500/20' : ''} ${className}`}
        aria-invalid={!!displayError}
        aria-describedby={displayError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        required={required}
        {...props}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {displayError && (
        <p id={`${inputId}-error`} className="text-xs text-red-600 dark:text-red-400" role="alert">
          {displayError}
        </p>
      )}
      {!displayError && helperText && (
        <p id={`${inputId}-helper`} className={`text-xs ${isDarkMode ? 'text-[#6E6E68]' : 'text-[#767670]'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;

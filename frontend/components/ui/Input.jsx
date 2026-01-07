import React from 'react';

const Input = ({ label, error, className = '', id, darkMode, ...props }) => {
  const inputId = id || props.name || Math.random().toString(36).substr(2, 9);
  const isDarkMode = darkMode !== undefined ? darkMode : document.documentElement.classList.contains('dark');

  return (
    <div className="w-full space-y-2">
      {label && (
        <label htmlFor={inputId} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 focus:ring-blue-500' : 'bg-white border-slate-300 text-slate-900 focus:ring-blue-400'} ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Input;
import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading,
  className = '',
  disabled,
  loadingLabel = 'Loading...',
  ariaLabel,
  darkMode,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium tracking-tight transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15803D] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer";

  const variants = {
    primary: "bg-[#111111] text-[#FAF9F6] border border-[#111111] hover:bg-[#262626] dark:bg-[#F5F5F3] dark:text-[#0A0A0A] dark:border-[#F5F5F3] dark:hover:bg-[#E4E4E0] shadow-[0_1px_2px_rgba(0,0,0,0.06)] active:translate-y-[1px]",
    accent: "bg-[#15803D] text-white border border-[#15803D] hover:bg-[#14532D] dark:bg-[#22C55E] dark:text-[#0A0A0A] dark:border-[#22C55E] dark:hover:bg-[#16A34A] shadow-[0_1px_2px_rgba(21,128,61,0.18)] active:translate-y-[1px]",
    secondary: "bg-[#F3F2EE] text-[#111111] border border-[#E4E4E0] hover:bg-[#EAE8E1] dark:bg-[#1A1A1A] dark:text-[#F5F5F3] dark:border-[#262626] dark:hover:bg-[#222222] active:translate-y-[1px]",
    danger: "bg-[#DC2626] text-white border border-[#DC2626] hover:bg-[#B91C1C] shadow-[0_1px_2px_rgba(220,38,38,0.18)] active:translate-y-[1px]",
    ghost: "bg-transparent text-[#4A4A46] hover:bg-[#F3F2EE] hover:text-[#111111] dark:text-[#A3A39E] dark:hover:bg-[#1A1A1A] dark:hover:text-[#F5F5F3]",
    outline: "border border-[#CFCFC8] bg-white text-[#111111] hover:bg-[#F3F2EE] dark:border-[#383838] dark:bg-[#141414] dark:text-[#F5F5F3] dark:hover:bg-[#1A1A1A] active:translate-y-[1px]"
  };

  const sizes = {
    sm: "min-h-[36px] px-3 text-xs",
    md: "min-h-[42px] px-4 py-2 text-sm",
    lg: "min-h-[48px] px-6 text-sm",
    icon: "min-h-[40px] min-w-[40px]",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      disabled={disabled || isLoading}
      aria-label={ariaLabel || (isLoading ? loadingLabel : undefined)}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;

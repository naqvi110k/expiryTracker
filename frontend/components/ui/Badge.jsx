import React from 'react';

const Badge = ({ children, variant = 'default', className = '', darkMode = false }) => {
  const getVariantClasses = () => {
    if (darkMode) {
      const darkVariants = {
        default: "border-[#19422B] bg-[#0D2116] text-[#4ADE80]",
        secondary: "border-[#262626] bg-[#1A1A1A] text-[#A3A39E]",
        destructive: "border-[#5E1A1A] bg-[#2A1212] text-[#F87171]",
        warning: "border-[#543813] bg-[#271A0B] text-[#FBBF24]",
        success: "border-[#19422B] bg-[#0D2116] text-[#4ADE80]",
        outline: "border-[#383838] bg-transparent text-[#F5F5F3]",
      };
      return darkVariants[variant] || darkVariants.default;
    } else {
      const lightVariants = {
        default: "border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]",
        secondary: "border-[#E4E4E0] bg-[#F3F2EE] text-[#4A4A46]",
        destructive: "border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]",
        warning: "border-[#FDE68A] bg-[#FFFBEB] text-[#B45309]",
        success: "border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]",
        outline: "border-[#CFCFC8] bg-white text-[#111111]",
      };
      return lightVariants[variant] || lightVariants.default;
    }
  };

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[11px] font-medium tracking-tight font-mono select-none ${getVariantClasses()} ${className}`}>
      {children}
    </div>
  );
};

export default Badge;

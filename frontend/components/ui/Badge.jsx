import React from 'react';

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200",
    secondary: "border-transparent bg-slate-100 text-slate-800 hover:bg-slate-200",
    destructive: "border-transparent bg-red-100 text-red-800 hover:bg-red-200",
    warning: "border-transparent bg-amber-100 text-amber-800 hover:bg-amber-200",
    success: "border-transparent bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
    outline: "text-slate-900 border-slate-200",
  };

  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

export default Badge;
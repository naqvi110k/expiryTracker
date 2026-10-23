/**
 * Theme constants and utilities for the teal/cyan aesthetic
 */

// Primary color palette
export const themeColors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a'
  },
  cyan: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63'
  },
  teal: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a'
  }
};

// Gradient definitions
export const gradients = {
  primary: 'from-blue-600 to-cyan-500',
  secondary: 'from-teal-500 to-cyan-500',
  success: 'from-emerald-500 to-green-500',
  warning: 'from-orange-500 to-red-500',
  danger: 'from-red-500 to-red-700',
  dashboardCard: 'from-blue-600 to-cyan-500'
};

// Theme utility functions
export const getThemeClass = (componentType, variant = 'default') => {
  switch(componentType) {
    case 'button':
      switch(variant) {
        case 'primary':
          return `bg-gradient-to-r ${gradients.primary} text-white hover:from-blue-700 hover:to-cyan-600`;
        case 'secondary':
          return `bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600`;
        case 'danger':
          return `bg-gradient-to-r ${gradients.danger} text-white hover:from-red-600 hover:to-red-800`;
        default:
          return `bg-gradient-to-r ${gradients.primary} text-white hover:from-blue-700 hover:to-cyan-600`;
      }
    case 'card':
      return `bg-gradient-to-br ${gradients.dashboardCard} p-0.5 rounded-xl`;
    case 'badge':
      switch(variant) {
        case 'success':
          return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
        case 'warning':
          return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
        case 'destructive':
          return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        case 'secondary':
          return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300';
        default:
          return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      }
    default:
      return '';
  }
};

// Apply theme to specific elements
export const applyTheme = (darkMode = false) => {
  // Apply theme classes based on mode
  const themeClasses = {
    body: darkMode 
      ? 'bg-slate-900 text-slate-100' 
      : 'bg-white text-slate-900',
    card: darkMode 
      ? 'bg-slate-800 border-slate-700' 
      : 'bg-white border-slate-200',
    input: darkMode 
      ? 'bg-slate-700 border-slate-600 text-slate-100' 
      : 'bg-white border-slate-200 text-slate-900',
    button: {
      primary: darkMode 
        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white'
        : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white',
      outline: darkMode 
        ? 'border-slate-600 text-slate-200 hover:bg-slate-700' 
        : 'border-slate-300 text-slate-700 hover:bg-slate-50'
    }
  };

  return themeClasses;
};

// Get appropriate text color based on background for accessibility
export const getAccessibleTextColor = (bgColor) => {
  // This is a simplified version - in practice you'd calculate luminance
  const darkBg = ['#000000', '#111827', '#1e293b', '#374151', '#4b5563'].includes(bgColor.toLowerCase());
  const mediumBg = ['#6b7280', '#9ca3af', '#d1d5db'].includes(bgColor.toLowerCase());
  
  if (darkBg) return 'text-white';
  if (mediumBg) return 'text-slate-900';
  return 'text-slate-900';
};

// Animation classes that fit the theme
export const themeAnimations = {
  cardHover: 'hover:-translate-y-1 hover:shadow-lg transition-all duration-300',
  fadeIn: 'animate-in fade-in duration-300',
  slideIn: 'animate-in slide-in-from-bottom-4 duration-300'
};
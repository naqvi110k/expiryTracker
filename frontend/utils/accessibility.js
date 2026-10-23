/**
 * Utility functions for accessibility
 */

// Function to calculate luminance of a color
function getLuminance(hexColor) {
  // Remove # if present
  const hex = hexColor.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  // Apply gamma correction
  const correctedR = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const correctedG = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const correctedB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  // Calculate luminance
  return 0.2126 * correctedR + 0.7152 * correctedG + 0.0722 * correctedB;
}

// Function to calculate contrast ratio between two colors
export function getContrastRatio(color1, color2) {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

// Function to check if contrast meets WCAG guidelines
export function checkContrastWCAG(backgroundColor, textColor) {
  const ratio = getContrastRatio(backgroundColor, textColor);
  
  return {
    ratio: parseFloat(ratio.toFixed(2)),
    passesAA: ratio >= 4.5, // Minimum for normal text
    passesAAA: ratio >= 7.0, // Enhanced for normal text
    passesAALarge: ratio >= 3.0, // Minimum for large text (>18pt or >14pt bold)
    passesAAALarge: ratio >= 4.5 // Enhanced for large text
  };
}

// Function to generate accessible color combinations
export function getAccessibleTextColor(backgroundColor) {
  const luminance = getLuminance(backgroundColor);
  
  // Use white text for darker backgrounds, black for lighter ones
  // This ensures good contrast ratios
  return luminance > 0.4 ? '#000000' : '#FFFFFF';
}

// Function to check if a given element is properly labeled for accessibility
export function isElementAccessible(element) {
  if (!element) return false;
  
  // Check if the element has proper labeling
  const hasAriaLabel = element.hasAttribute('aria-label') || element.getAttribute('aria-labelledby');
  const hasLabel = element.tagName === 'INPUT' && element.id && 
    document.querySelector(`label[for="${element.id}"]`);
  const hasTitle = element.hasAttribute('title');
  
  return hasAriaLabel || hasLabel || hasTitle;
}

// Focus trap utility for modal dialogs
export function focusTrap(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleTab = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  };

  element.addEventListener('keydown', handleTab);

  return () => {
    element.removeEventListener('keydown', handleTab);
  };
}

// Keyboard navigation helper for grid items
export function handleGridKeyboardNavigation(containerRef, itemsRef, callback) {
  const container = containerRef.current;
  const items = itemsRef.current;

  if (!container || !items || items.length === 0) return;

  let currentIndex = 0;

  const handleKeyDown = (e) => {
    if (!items[currentIndex]) return;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        currentIndex = (currentIndex + 1) % items.length;
        items[currentIndex].focus();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        items[currentIndex].focus();
        break;
      case 'ArrowDown':
        e.preventDefault();
        // Move to item in next row (assuming grid layout)
        const currentRect = items[currentIndex].getBoundingClientRect();
        const nextRowItems = Array.from(items).filter(item => {
          const rect = item.getBoundingClientRect();
          return rect.top > currentRect.top && rect.left === currentRect.left;
        });
        
        if (nextRowItems.length > 0) {
          const nextItem = nextRowItems[0];
          currentIndex = Array.from(items).indexOf(nextItem);
          nextItem.focus();
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        // Move to item in previous row
        const prevRowItems = Array.from(items).filter(item => {
          const rect = item.getBoundingClientRect();
          return rect.top < currentRect.top && rect.left === currentRect.left;
        });
        
        if (prevRowItems.length > 0) {
          const prevItem = prevRowItems[prevRowItems.length - 1];
          currentIndex = Array.from(items).indexOf(prevItem);
          prevItem.focus();
        }
        break;
      case 'Enter':
      case ' ': // Space bar
        e.preventDefault();
        callback && callback(items[currentIndex]);
        break;
    }
  };

  container.addEventListener('keydown', handleKeyDown);

  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

// Screen reader announcement helper
export function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after a delay to ensure it's announced
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Skip link for keyboard users
export function createSkipLink(targetId) {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'skip-link';
  skipLink.style.position = 'absolute';
  skipLink.style.left = '-10000px';
  skipLink.style.top = 'auto';
  skipLink.style.width = '1px';
  skipLink.style.height = '1px';
  skipLink.style.overflow = 'hidden';
  
  skipLink.addEventListener('focus', () => {
    skipLink.style.position = 'static';
    skipLink.style.width = 'auto';
    skipLink.style.height = 'auto';
    skipLink.style.overflow = 'visible';
  });
  
  skipLink.addEventListener('blur', () => {
    skipLink.style.position = 'absolute';
    skipLink.style.left = '-10000px';
    skipLink.style.top = 'auto';
    skipLink.style.width = '1px';
    skipLink.style.height = '1px';
    skipLink.style.overflow = 'hidden';
  });
  
  document.body.insertBefore(skipLink, document.body.firstChild);
}

// Check if device has reduced motion preference
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Apply focus styles only when using keyboard navigation
export function initFocusIndicator() {
  let keyboardNavigation = false;
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      keyboardNavigation = true;
      document.body.classList.add('keyboard-nav');
    }
  });
  
  document.addEventListener('mousedown', () => {
    keyboardNavigation = false;
    document.body.classList.remove('keyboard-nav');
  });
}

// Update focus indicator based on navigation method
export function updateFocusIndicator() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });
  
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });
}
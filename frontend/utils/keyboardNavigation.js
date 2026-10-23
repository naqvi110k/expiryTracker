/**
 * Keyboard navigation utilities for accessibility
 */

// Function to trap focus inside a modal or dialog
export function trapFocus(element, firstCallback, lastCallback) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };

  element.addEventListener('keydown', handleKeyDown);

  // Clean up function
  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
}

// Function to handle keyboard shortcuts for common actions
export function handleKeyboardShortcuts(keyMap, element = document) {
  const handleKeyDown = (e) => {
    // Skip if focus is on input-like elements
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
      return;
    }

    const key = e.key.toLowerCase();
    const ctrlCmd = e.ctrlKey || e.metaKey;
    const shift = e.shiftKey;

    // Check for matching shortcut
    const shortcut = Object.keys(keyMap).find(shortcut => {
      const [mod, ...rest] = shortcut.split('+');
      const shortcutKey = rest.join('+').toLowerCase();

      if (mod.toLowerCase() === 'ctrl' && ctrlCmd && key === shortcutKey) {
        return true;
      }
      if (mod.toLowerCase() === 'shift' && shift && key === shortcutKey) {
        return true;
      }
      if (shortcut.toLowerCase() === key) {
        return true;
      }

      return false;
    });

    if (shortcut && keyMap[shortcut]) {
      e.preventDefault();
      keyMap[shortcut](e);
    }
  };

  element.addEventListener('keydown', handleKeyDown);

  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
}

// Function to make elements focusable and keyboard operable
export function makeAccessible(widget) {
  if (!widget) return;

  // Add ARIA roles and attributes
  widget.setAttribute('role', widget.getAttribute('role') || 'button');
  widget.setAttribute('tabIndex', widget.getAttribute('tabIndex') || '0');

  // Handle Enter and Space keys for activation
  const handleClick = (e) => {
    if (e.type === 'click' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      widget.click();
    }
  };

  widget.addEventListener('click', handleClick);
  widget.addEventListener('keydown', handleClick);

  return () => {
    widget.removeEventListener('click', handleClick);
    widget.removeEventListener('keydown', handleClick);
  };
}

// Function to manage focus when components mount/unmount
export function manageFocus(returnFocusTo) {
  const previousFocus = document.activeElement;

  return () => {
    if (returnFocusTo && returnFocusTo.focus) {
      returnFocusTo.focus();
    } else if (previousFocus && previousFocus.focus) {
      previousFocus.focus();
    }
  };
}
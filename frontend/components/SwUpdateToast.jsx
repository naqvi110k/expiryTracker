import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

/**
 * SwUpdateToast
 * Detects when a new Service Worker is waiting and prompts the user to update.
 * Uses vite-plugin-pwa's useRegisterSW hook — no extra deps needed.
 */
export default function SwUpdateToast() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('[SW] Registered:', r);
    },
    onRegisterError(error) {
      console.error('[SW] Registration error:', error);
    },
  });

  if (!needRefresh) return null;

  return (
    <div className="sw-update-toast" role="alert" aria-live="polite">
      <span className="sw-update-toast__icon">🔄</span>
      <span className="sw-update-toast__text">New version available!</span>
      <button
        className="sw-update-toast__btn"
        onClick={() => updateServiceWorker(true)}
      >
        Update Now
      </button>
    </div>
  );
}

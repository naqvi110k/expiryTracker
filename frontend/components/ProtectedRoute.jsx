import React from 'react';
import { isAuthenticated } from '../services/authService';

const ProtectedRoute = ({ children, fallback }) => {
  const authed = isAuthenticated();
  if (!authed) {
    return fallback || null;
  }
  return children;
};

export default ProtectedRoute;



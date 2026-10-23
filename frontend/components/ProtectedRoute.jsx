import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';

const ProtectedRoute = ({ children, fallback, redirectTo = '/login' }) => {
  const authed = isAuthenticated();
  const location = useLocation();
  if (!authed) {
    return (
      fallback || (
        <Navigate
          to={redirectTo}
          replace
          state={{ from: location.pathname + location.search + location.hash }}
        />
      )
    );
  }
  return children;
};

export default ProtectedRoute;

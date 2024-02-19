import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, isAuthenticated, fallbackPath = '/' }) => {
  return isAuthenticated ? (
    element
  ) : (
    <Navigate to={fallbackPath} replace />
  );
};

export default PrivateRoute;

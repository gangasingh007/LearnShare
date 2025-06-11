import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../utils/api';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!getToken();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
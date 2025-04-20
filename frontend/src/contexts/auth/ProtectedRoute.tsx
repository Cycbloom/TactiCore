import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from './AuthProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
  showLoading?: boolean;
  loadingComponent?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  showLoading = true,
  loadingComponent = <div>Loading...</div>
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading && showLoading) {
    return <>{loadingComponent}</>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

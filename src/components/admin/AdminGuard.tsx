import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useRBAC } from '../../hooks/useRBAC';
import { useSessionContext } from '../../providers/SessionProvider';
import { LoadingScreen } from '../Loading';

interface AdminGuardProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'editor' | 'viewer';
}

export const AdminGuard: React.FC<AdminGuardProps> = ({
  children,
  requiredRole = 'admin'
}) => {
  const { user } = useAuth();
  const { role, loading } = useRBAC();
  const { isAuthenticated } = useSessionContext();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated || !user || !role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const hasAccess = role === 'admin' || (
    requiredRole === 'editor' && ['admin', 'editor'].includes(role) ||
    requiredRole === 'viewer' && ['admin', 'editor', 'viewer'].includes(role)
  );

  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
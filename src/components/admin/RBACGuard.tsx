import React from 'react';
import { useRBAC } from '../../hooks/useRBAC';

interface RBACGuardProps {
  action: string;
  subject: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const RBACGuard: React.FC<RBACGuardProps> = ({
  action,
  subject,
  fallback = null,
  children,
}) => {
  const { can, loading } = useRBAC();

  if (loading) return null;
  
  return can(action, subject) ? <>{children}</> : <>{fallback}</>;
}
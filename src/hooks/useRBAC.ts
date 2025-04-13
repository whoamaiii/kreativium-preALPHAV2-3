import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { rbac, Role, Permission } from '../lib/rbac';

export function useRBAC() {
  const { user } = useAuth();
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRole = async () => {
      setLoading(true);
      const userRole = await rbac.loadUserRole(user);
      setRole(userRole);
      setLoading(false);
    };

    loadRole();
  }, [user]);

  const can = (action: string, subject: string): boolean => {
    return rbac.can(action, subject);
  };

  return {
    role,
    loading,
    can,
    isAdmin: role === 'admin',
    isEditor: role === 'editor',
    isViewer: role === 'viewer',
  };
}
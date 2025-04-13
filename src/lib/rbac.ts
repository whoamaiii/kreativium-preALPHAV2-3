import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export type Role = 'admin' | 'editor' | 'viewer';

export interface Permission {
  action: string;
  subject: string;
}

// Define permissions for each role
export const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    { action: 'manage', subject: 'all' },
  ],
  editor: [
    { action: 'create', subject: 'quiz' },
    { action: 'update', subject: 'quiz' },
    { action: 'delete', subject: 'quiz' },
    { action: 'create', subject: 'memory_game' },
    { action: 'update', subject: 'memory_game' },
    { action: 'delete', subject: 'memory_game' },
    { action: 'create', subject: 'media' },
    { action: 'update', subject: 'media' },
    { action: 'delete', subject: 'media' },
  ],
  viewer: [
    { action: 'read', subject: 'quiz' },
    { action: 'read', subject: 'memory_game' },
    { action: 'read', subject: 'media' },
  ],
};

export class RBAC {
  private static instance: RBAC;
  private userRole: Role | null = null;

  private constructor() {}

  static getInstance(): RBAC {
    if (!RBAC.instance) {
      RBAC.instance = new RBAC();
    }
    return RBAC.instance;
  }

  async loadUserRole(user: User | null): Promise<Role | null> {
    if (!user) {
      this.userRole = null;
      return null;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        this.userRole = userDoc.data().role as Role;
        return this.userRole;
      }
      return null;
    } catch (error) {
      console.error('Error loading user role:', error);
      return null;
    }
  }

  can(action: string, subject: string): boolean {
    if (!this.userRole) return false;

    // Admin has all permissions
    if (this.userRole === 'admin') return true;

    const permissions = rolePermissions[this.userRole];
    return permissions.some(
      permission =>
        (permission.action === action || permission.action === 'manage') &&
        (permission.subject === subject || permission.subject === 'all')
    );
  }

  getRole(): Role | null {
    return this.userRole;
  }
}

export const rbac = RBAC.getInstance();
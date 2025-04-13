import { collection, addDoc, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { AdminUser } from '../types/admin';

export type AuditAction = 
  | 'user.create'
  | 'user.update'
  | 'user.delete'
  | 'role.change'
  | 'quiz.create'
  | 'quiz.update'
  | 'quiz.delete'
  | 'category.create'
  | 'category.update'
  | 'category.delete'
  | 'media.upload'
  | 'media.delete'
  | 'settings.update';

export interface AuditLog {
  id: string;
  action: AuditAction;
  performedBy: {
    id: string;
    email: string;
    role: string;
  };
  timestamp: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
}

class AuditLogger {
  private async getClientInfo() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return {
        ipAddress: data.ip,
        userAgent: window.navigator.userAgent,
      };
    } catch (error) {
      return {
        ipAddress: 'unknown',
        userAgent: window.navigator.userAgent,
      };
    }
  }

  async log(
    action: AuditAction,
    user: AdminUser,
    details: Record<string, any>
  ): Promise<void> {
    try {
      const clientInfo = await this.getClientInfo();
      
      const logEntry: Omit<AuditLog, 'id'> = {
        action,
        performedBy: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        timestamp: new Date().toISOString(),
        details,
        ...clientInfo,
      };

      await addDoc(collection(db, 'auditLogs'), logEntry);
    } catch (error) {
      console.error('Failed to create audit log:', error);
      throw new Error('Failed to create audit log');
    }
  }

  async query(options: {
    action?: AuditAction;
    userId?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }) {
    try {
      let q = collection(db, 'auditLogs');
      const conditions = [];

      if (options.action) {
        conditions.push(where('action', '==', options.action));
      }

      if (options.userId) {
        conditions.push(where('performedBy.id', '==', options.userId));
      }

      if (options.startDate) {
        conditions.push(where('timestamp', '>=', options.startDate.toISOString()));
      }

      if (options.endDate) {
        conditions.push(where('timestamp', '<=', options.endDate.toISOString()));
      }

      q = query(
        q,
        ...conditions,
        orderBy('timestamp', 'desc'),
        ...(options.limit ? [limit(options.limit)] : [])
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AuditLog[];
    } catch (error) {
      console.error('Failed to query audit logs:', error);
      throw new Error('Failed to query audit logs');
    }
  }

  async getRecentLogs(limit = 50): Promise<AuditLog[]> {
    return this.query({ limit });
  }

  async getUserActions(userId: string, limit = 50): Promise<AuditLog[]> {
    return this.query({ userId, limit });
  }

  async getActionsByType(action: AuditAction, limit = 50): Promise<AuditLog[]> {
    return this.query({ action, limit });
  }
}

export const auditLogger = new AuditLogger();
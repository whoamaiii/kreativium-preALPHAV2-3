import { useQuery } from '@tanstack/react-query';
import { auditLogger, AuditAction, AuditLog } from '../lib/auditLogger';

interface UseAuditLogsOptions {
  action?: AuditAction;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}

export function useAuditLogs(options: UseAuditLogsOptions = {}) {
  return useQuery({
    queryKey: ['auditLogs', options],
    queryFn: () => auditLogger.query(options),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useRecentAuditLogs(limit = 50) {
  return useQuery({
    queryKey: ['recentAuditLogs', limit],
    queryFn: () => auditLogger.getRecentLogs(limit),
    staleTime: 1000 * 60 * 5,
  });
}

export function useUserAuditLogs(userId: string, limit = 50) {
  return useQuery({
    queryKey: ['userAuditLogs', userId, limit],
    queryFn: () => auditLogger.getUserActions(userId, limit),
    staleTime: 1000 * 60 * 5,
  });
}
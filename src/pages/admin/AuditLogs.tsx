import React, { useState } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Search, Filter, Download } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FormInput } from '../../components/Form/FormInput';
import { FormSelect } from '../../components/Form/FormSelect';
import { useAuditLogs } from '../../hooks/useAuditLogs';
import { AuditAction } from '../../lib/auditLogger';

export const AuditLogs: React.FC = () => {
  const [selectedAction, setSelectedAction] = useState<AuditAction | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  }>({
    start: '',
    end: '',
  });

  const { data: logs, isLoading } = useAuditLogs({
    action: selectedAction as AuditAction | undefined,
    startDate: dateRange.start ? new Date(dateRange.start) : undefined,
    endDate: dateRange.end ? new Date(dateRange.end) : undefined,
  });

  const filteredLogs = logs?.filter(log =>
    log.performedBy.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportLogs = () => {
    const csv = [
      ['Timestamp', 'Action', 'User', 'Details', 'IP Address'].join(','),
      ...filteredLogs!.map(log => [
        format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss'),
        log.action,
        log.performedBy.email,
        JSON.stringify(log.details),
        log.ipAddress,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Audit Logs</h1>
          <p className="text-gray-400">Track and monitor admin activities</p>
        </div>

        <Button onClick={exportLogs}>
          <Download className="w-5 h-5 mr-2" />
          Export Logs
        </Button>
      </div>

      <Card className="p-6 mb-8">
        <div className="grid gap-4 md:grid-cols-4">
          <FormInput
            name="search"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />

          <FormSelect
            name="action"
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value as AuditAction)}
            options={[
              { value: '', label: 'All Actions' },
              { value: 'user.create', label: 'User Created' },
              { value: 'user.update', label: 'User Updated' },
              { value: 'user.delete', label: 'User Deleted' },
              { value: 'role.change', label: 'Role Changed' },
              { value: 'quiz.create', label: 'Quiz Created' },
              { value: 'quiz.update', label: 'Quiz Updated' },
              { value: 'quiz.delete', label: 'Quiz Deleted' },
            ]}
          />

          <FormInput
            type="date"
            name="startDate"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
          />

          <FormInput
            type="date"
            name="endDate"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
          />
        </div>
      </Card>

      <div className="space-y-4">
        {isLoading ? (
          <Card className="p-8 text-center">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto mb-4" />
              <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto" />
            </div>
          </Card>
        ) : filteredLogs?.length === 0 ? (
          <Card className="p-8 text-center">
            <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">No Logs Found</h2>
            <p className="text-gray-400">
              Try adjusting your filters to see more results
            </p>
          </Card>
        ) : (
          filteredLogs?.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">
                      {format(new Date(log.timestamp), 'PPpp')}
                    </p>
                    <p className="font-medium text-white">
                      {log.performedBy.email}
                    </p>
                    <p className="text-purple-400">{log.action}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">
                      IP: {log.ipAddress}
                    </p>
                    <p className="text-sm text-gray-500">
                      {log.userAgent}
                    </p>
                  </div>
                </div>
                <div className="mt-2 p-2 bg-gray-800 rounded-lg">
                  <pre className="text-sm text-gray-300 overflow-x-auto">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
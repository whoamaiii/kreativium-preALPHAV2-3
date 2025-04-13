import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Shield } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { AdminUser } from '../../types/admin';

interface UserListProps {
  users: AdminUser[];
  onEdit: (user: AdminUser) => void;
  onDelete: (id: string) => void;
}

export const UserList: React.FC<UserListProps> = ({
  users,
  onEdit,
  onDelete,
}) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-red-500';
      case 'editor':
        return 'text-yellow-500';
      default:
        return 'text-blue-500';
    }
  };

  return (
    <div className="space-y-4">
      {users.map((user, index) => (
        <motion.div
          key={user.id}
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                  {user.displayName?.[0] || user.email[0]}
                </div>
                
                <div>
                  <h3 className="font-medium text-white">
                    {user.displayName || user.email}
                  </h3>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>

                <div className={`flex items-center gap-1 ${getRoleColor(user.role)}`}>
                  <Shield className="w-4 h-4" />
                  <span className="text-sm capitalize">{user.role}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onEdit(user)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onDelete(user.id)}
                  className="hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
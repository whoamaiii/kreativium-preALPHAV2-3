import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, Upload } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { UserList } from '../../components/admin/UserList';
import { UserEditor } from '../../components/admin/UserEditor';
import { useUserManagement } from '../../hooks/useUserManagement';
import { useToast } from '../../hooks/useToast';
import { AdminUser } from '../../types/admin';

export const UserManagement: React.FC = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const { users, addUser, updateUser, deleteUser, exportUsers, importUsers } = useUserManagement();
  const { addToast } = useToast();

  const handleSave = async (user: AdminUser) => {
    try {
      if (editingUser) {
        await updateUser(user);
        addToast('User updated successfully!', 'success');
      } else {
        await addUser(user);
        addToast('User created successfully!', 'success');
      }
      setShowEditor(false);
      setEditingUser(null);
    } catch (error) {
      addToast('Failed to save user', 'error');
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await importUsers(file);
      addToast('Users imported successfully!', 'success');
    } catch (error) {
      addToast('Failed to import users', 'error');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-gray-400">Manage user accounts and roles</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setShowEditor(true)}>
            <Plus className="w-5 h-5 mr-2" />
            New User
          </Button>

          <Button variant="secondary" onClick={exportUsers}>
            <Download className="w-5 h-5 mr-2" />
            Export
          </Button>

          <label className="relative">
            <Button variant="secondary" as="div">
              <Upload className="w-5 h-5 mr-2" />
              Import
            </Button>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {showEditor ? (
        <UserEditor
          user={editingUser}
          onSave={handleSave}
          onCancel={() => {
            setShowEditor(false);
            setEditingUser(null);
          }}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <UserList
            users={users}
            onEdit={(user) => {
              setEditingUser(user);
              setShowEditor(true);
            }}
            onDelete={deleteUser}
          />
        </motion.div>
      )}
    </div>
  );
};
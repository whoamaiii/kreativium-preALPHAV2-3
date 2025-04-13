import React from 'react';
import { motion } from 'framer-motion';
import { Image, BookOpen, Brain, FolderTree, Users } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const modules = [
    {
      title: 'Media Library',
      description: 'Manage images and media files',
      icon: Image,
      path: '/admin/media',
      color: 'text-blue-500',
      bgGlow: 'before:bg-blue-500/20',
    },
    {
      title: 'Quiz Builder',
      description: 'Create and manage quizzes',
      icon: BookOpen,
      path: '/admin/quizzes',
      color: 'text-purple-500',
      bgGlow: 'before:bg-purple-500/20',
    },
    {
      title: 'Memory Games',
      description: 'Design memory card games',
      icon: Brain,
      path: '/admin/memory-games',
      color: 'text-pink-500',
      bgGlow: 'before:bg-pink-500/20',
    },
    {
      title: 'Categories',
      description: 'Organize content categories',
      icon: FolderTree,
      path: '/admin/categories',
      color: 'text-green-500',
      bgGlow: 'before:bg-green-500/20',
    },
    {
      title: 'User Management',
      description: 'Manage user accounts and roles',
      icon: Users,
      path: '/admin/users',
      color: 'text-yellow-500',
      bgGlow: 'before:bg-yellow-500/20',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">
          Welcome back, {user?.displayName || 'Admin'}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module, index) => {
          const Icon = module.icon;
          
          return (
            <motion.div
              key={module.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                onClick={() => navigate(module.path)}
                className={`
                  relative p-6 overflow-hidden
                  hover:scale-105 transform transition-all cursor-pointer
                  bg-gray-900/50 backdrop-blur-sm group
                  before:absolute before:inset-0 before:opacity-0
                  before:transition-opacity before:rounded-lg
                  before:blur-xl group-hover:before:opacity-100
                  ${module.bgGlow}
                `}
              >
                <div className="relative z-10">
                  <Icon className={`w-12 h-12 mb-4 ${module.color}`} />
                  <h2 className="text-xl font-bold text-white mb-2">
                    {module.title}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {module.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
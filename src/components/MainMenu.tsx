import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Gamepad2, Brain, Heart, Users, Target, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from './ui/Card';

export const MainMenu: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Simplified menu items array
  const menuItems = [
    {
      id: 'quiz',
      title: t('quiz.title', 'Quiz'),
      description: t('quiz.subtitle', 'Test your knowledge'),
      icon: Gamepad2,
      color: 'text-blue-500',
      bgGlow: 'before:bg-blue-500/20',
    },
    {
      id: 'memory',
      title: t('memory.title', 'Memory'),
      description: t('memory.subtitle', 'Train your memory'),
      icon: Brain,
      color: 'text-purple-500',
      bgGlow: 'before:bg-purple-500/20',
    },
    {
      id: 'feelings-tracker',
      title: 'Følelseslogg',
      description: 'Track emotions',
      icon: Heart,
      color: 'text-red-500',
      bgGlow: 'before:bg-red-500/20',
    },
    {
      id: 'kids',
      title: 'Barn',
      description: 'Manage kids',
      icon: Users,
      color: 'text-yellow-500',
      bgGlow: 'before:bg-yellow-500/20',
    },
    {
      id: 'ilp',
      title: 'IOP',
      description: 'Learning Plans',
      icon: Target,
      color: 'text-green-500',
      bgGlow: 'before:bg-green-500/20',
    },
    {
      id: 'custom',
      title: 'Custom',
      description: 'Custom activities',
      icon: LayoutGrid,
      color: 'text-teal-500',
      bgGlow: 'before:bg-teal-500/20',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6 text-center">ASK Application</h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="transform transition-all"
          >
            <Card
              onClick={() => navigate(`/${item.id}`)}
              className={`
                relative p-6 overflow-hidden
                hover:scale-105 cursor-pointer
                bg-gray-800 group
              `}
            >
              <div className="relative z-10">
                {React.createElement(item.icon, { className: `w-12 h-12 mx-auto mb-4 ${item.color}` })}
                <h2 className="text-xl font-bold text-white mb-2 text-center">
                  {item.title}
                </h2>
                <p className="text-gray-400 text-sm text-center">
                  {item.description}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

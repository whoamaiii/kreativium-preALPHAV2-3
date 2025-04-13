import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Image,
  BookOpen,
  Brain,
  FolderTree,
  Users,
  BarChart2,
  ClipboardList,
  GitBranch,
} from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Dashboard', path: '/admin' },
  { icon: Image, label: 'Media Library', path: '/admin/media' },
  { icon: BookOpen, label: 'Quiz Builder', path: '/admin/quizzes' },
  { icon: Brain, label: 'Memory Games', path: '/admin/memory-games' },
  { icon: FolderTree, label: 'Categories', path: '/admin/categories' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: BarChart2, label: 'Analytics', path: '/admin/analytics' },
  { icon: ClipboardList, label: 'Audit Logs', path: '/admin/audit-logs' },
  { icon: GitBranch, label: 'Workflow', path: '/admin/workflow' },
];

export const AdminSidebar: React.FC = () => {
  return (
    <aside className="w-64 min-h-screen bg-gray-900/50 backdrop-blur-sm border-r border-gray-800">
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-2 rounded-lg
                  transition-colors duration-200
                  ${isActive
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../Header';
import { AnimatedBackground } from '../AnimatedBackground';
import { Toast } from '../Toast';
import { useStore } from '../../store';

export const Layout: React.FC = () => {
  const isDark = useStore((state) => state.settings.theme === 'dark');

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'dark bg-dark-primary' : 'bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100'
    }`}>
      <AnimatedBackground />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <Header />
        <main className="max-w-4xl mx-auto">
          <Outlet />
        </main>
      </div>

      <Toast />
    </div>
  );
};
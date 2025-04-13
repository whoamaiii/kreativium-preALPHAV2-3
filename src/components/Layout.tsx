import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Heart, Sparkles, Moon, Sun, Settings } from 'lucide-react';
import { Button } from './ui/Button';
import { useDarkMode } from '../hooks/useDarkMode';

export const Layout: React.FC = () => {
  const [isDark, setIsDark] = useDarkMode();

  return (
    <div className="min-h-screen">
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <Link to="/" className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-pink-500 animate-float" />
            <h1 className="text-3xl font-bold text-white">Ask123</h1>
            <Sparkles className="w-8 h-8 text-yellow-500 animate-glitter" />
          </Link>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDark(!isDark)}
              className="text-gray-400 hover:text-white"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

            <Link to="/settings">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-8">
        <Outlet />
      </main>
    </div>
  );
};
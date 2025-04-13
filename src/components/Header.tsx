import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Moon, Sun, Settings } from 'lucide-react';
import { Button } from './ui/Button';
import { useSettings } from '../hooks/useSettings';
import { KidSelector } from './KidSelector';
import StandaloneAAC from './StandaloneAAC';

export const Header: React.FC = () => {
  const { settings, updateSettings } = useSettings();

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  return (
    <header className="bg-[#1a1625]/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-pink-500 animate-float" />
            <h1 className="text-3xl font-bold text-white">Ask123</h1>
            <Sparkles className="w-8 h-8 text-yellow-500 animate-glitter" />
          </Link>

          <div className="flex items-center gap-4">
            <StandaloneAAC />
            <KidSelector />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-gray-400 hover:text-white"
            >
              {settings.theme === 'dark' ? (
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
      </div>
    </header>
  );
};
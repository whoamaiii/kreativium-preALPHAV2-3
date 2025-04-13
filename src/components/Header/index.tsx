import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Sparkles, Moon, Sun, BarChart, Settings, LogOut } from 'lucide-react';
import { Button } from '../Button';
import { useAuth } from '../../hooks/useAuth';
import { useDarkMode } from '../../hooks/useDarkMode';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isDark, setIsDark] = useDarkMode();

  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  return (
    <header className="mb-8">
      <div className="flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-pink-500 animate-float" />
            <h1 className="text-4xl font-bold dark:text-white">Ask123</h1>
            <Sparkles className="w-8 h-8 text-yellow-500 animate-glitter" />
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsDark(!isDark)}
            className="animate-bounce-subtle"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/settings')}
          >
            <Settings className="w-5 h-5" />
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/stats')}
          >
            <BarChart className="w-5 h-5" />
          </Button>

          {user && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSignOut}
              className="group"
            >
              <LogOut className="w-5 h-5 group-hover:text-red-500 transition-colors" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
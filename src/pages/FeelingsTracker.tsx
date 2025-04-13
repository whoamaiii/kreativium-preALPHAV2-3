import React, { useEffect, useState } from 'react';
import { EmotionLogger } from '../components/FeelingsTracker/EmotionLogger';
import { VisualizationDashboard } from '../components/FeelingsTracker/VisualizationDashboard';
import { useAuthContext } from '../hooks/useAuthContext';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TabView } from '../components/ui/TabView';
import { Link } from 'react-router-dom';
import { User, Users, Plus, RefreshCw } from 'lucide-react';
import { resetAllAppData } from '../lib/resetAppData';

// User switcher component that dynamically shows all available users
const UserSwitcher: React.FC = () => {
  const { user, login, getChildUsers, getUsers } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const childUsers = getChildUsers();
  const teacherUsers = getUsers().filter(u => u.role === 'teacher');

  const handleLogin = (userId: string) => {
    setIsLoading(true);
    login(userId);
    setTimeout(() => setIsLoading(false), 300); // Brief loading state for better UX
  };

  const handleResetAppData = () => {
    if (window.confirm('This will reset all emotion data and user preferences. Continue?')) {
      resetAllAppData();
    }
  };

  return (
    <Card className="mb-5">
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h3 className="mb-2 text-lg font-medium">Currently logged in as:</h3>
            <span className={`inline-block px-3 py-1 rounded-md font-medium ${
              user?.role === 'teacher' ? 'bg-green-900/30 text-green-400' : 'bg-blue-900/30 text-blue-400'
            }`}>
              {user?.name || 'No user'} {user?.role ? `(${user.role})` : ''}
            </span>
          </div>
          
          {/* Teacher login section - more prominent */}
          <div className="mt-3 md:mt-0">
            <h4 className="text-sm font-medium text-gray-400 mb-2 text-center">Teacher Access</h4>
            {teacherUsers.map(teacherUser => (
              <Button
                key={teacherUser.id}
                variant={user?.id === teacherUser.id ? 'primary' : 'secondary'}
                onClick={() => handleLogin(teacherUser.id)}
                className="flex items-center gap-1 w-full"
                disabled={isLoading}
              >
                <Users className="w-4 h-4" />
                {teacherUser.name}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Children section */}
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-2">Children</h4>
          {childUsers.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {childUsers.map(childUser => (
                <Button
                  key={childUser.id}
                  variant={user?.id === childUser.id ? 'primary' : 'ghost'}
                  onClick={() => handleLogin(childUser.id)}
                  className="flex items-center gap-1"
                  disabled={isLoading}
                >
                  <User className="w-4 h-4" />
                  {childUser.name}
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-400 mb-2">No children added yet.</p>
              <Link to="/kids">
                <Button variant="primary" className="flex items-center gap-1">
                  <Plus className="w-4 h-4" />
                  Add a child
                </Button>
              </Link>
            </div>
          )}
        </div>
        
        {/* Reset button - for debugging */}
        <div className="mt-2 border-t border-gray-700 pt-3">
          <Button 
            variant="ghost" 
            className="text-xs text-gray-400 flex items-center gap-1"
            onClick={handleResetAppData}
          >
            <RefreshCw className="w-3 h-3" />
            Reset app data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Content component that renders based on user role
const FeelingsTrackerContent: React.FC = () => {
  const { user } = useAuthContext();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Wait for hydration to complete before rendering content
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse h-8 w-48 bg-gray-700 rounded-md mx-auto mb-4" />
        <div className="animate-pulse h-4 w-64 bg-gray-700 rounded-md mx-auto" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12 px-5">
        <h2 className="text-xl mb-2">Please log in to use the Feelings Tracker</h2>
        <p className="text-zinc-400">Select a user from the options above to continue.</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-6xl mx-auto">
      <UserSwitcher />
      
      {user.role === 'child' ? (
        <Card className="mb-8">
          <CardContent>
            <EmotionLogger />
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-8">
          <CardContent>
            <TabView 
              tabs={[
                { id: 'my-emotions', label: 'My Emotions' },
                { id: 'student-dashboard', label: 'Student Dashboard' }
              ]}
              defaultActiveTab="my-emotions"
            >
              <EmotionLogger />
              <VisualizationDashboard />
            </TabView>
          </CardContent>
        </Card>
      )}
      
      <Card className="text-sm text-zinc-300">
        <CardContent>
          <h3 className="font-semibold text-white mb-3 text-lg">About Feelings Tracker</h3>
          <p className="mb-3">
            This tool helps children identify and express their emotions, while providing teachers 
            with insights into emotional patterns. Data is processed using Sequential Thinking
            patterns to identify potential trends and support needs.
          </p>
          <p className="mb-2">
            <strong>For children:</strong> Select the emoji that best matches how you feel right now.
            You can add a note about why you feel this way if you'd like.
          </p>
          <p>
            <strong>For teachers:</strong> View analytics and patterns to better understand
            emotional trends and potential support opportunities.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

// Error boundary component
const ErrorFallback: React.FC<{ error: Error; resetError: () => void }> = ({ error, resetError }) => {
  const handleReset = () => {
    resetAllAppData();
    resetError();
  };

  return (
    <div className="bg-red-900/30 p-4 rounded-lg text-white mb-6">
      <h3 className="text-xl font-bold mb-2">Something went wrong</h3>
      <p className="mb-4">There was an error loading the Feelings Tracker: {error.message}</p>
      <div className="flex space-x-4">
        <Button onClick={resetError} variant="primary">
          Try again
        </Button>
        <Button onClick={handleReset} variant="secondary">
          Reset app data
        </Button>
      </div>
    </div>
  );
};

// Main component with error handling
const FeelingsTracker: React.FC = () => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleError = (error: Error) => {
    console.error('Feelings Tracker error:', error);
    setError(error);
    setHasError(true);
  };

  const resetError = () => {
    setError(null);
    setHasError(false);
  };

  useEffect(() => {
    // Ensure localStorage is working
    try {
      localStorage.setItem('feelings_tracker_test', 'test');
      localStorage.removeItem('feelings_tracker_test');
    } catch (error) {
      handleError(new Error('Unable to access localStorage. Please check browser settings.'));
    }
  }, []);

  return (
    <div className="bg-zinc-900 text-white min-h-screen">
      <header className="bg-purple-900 py-6 px-4 mb-8 text-center">
        <h1 className="text-4xl font-bold text-purple-300 mb-1">Feelings Tracker</h1>
        <p className="text-zinc-300">
          Track, understand, and visualize emotional patterns
        </p>
      </header>

      {hasError && error ? (
        <div className="container mx-auto px-4">
          <ErrorFallback error={error} resetError={resetError} />
          <FeelingsTrackerContent />
        </div>
      ) : (
        <FeelingsTrackerContent />
      )}
    </div>
  );
};

export default FeelingsTracker;

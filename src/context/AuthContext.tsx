import React, { createContext, useState, ReactNode, useEffect, useContext } from 'react';
import { User } from '../types/user';
import { Kid } from '../types/kid';
import { KidsContext } from './KidsContext';

// Mock teacher/admin users for demonstration
const STATIC_USERS: Record<string, User> = {
  'teacher789': {
    id: 'teacher789',
    name: 'Ms. Taylor',
    role: 'teacher'
  }
};

// Local storage keys
const USER_STORAGE_KEY = 'emotion_tracker_current_user';

// Define the shape of our context
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userId: string) => boolean;
  logout: () => void;
  getUsers: () => User[];
  getChildUsers: () => User[];
}

// Create the context with undefined as default value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component props
interface AuthProviderProps {
  children: ReactNode;
  initialUser?: string;
}

// Convert Kid to User
const kidToUser = (kid: Kid): User => ({
  id: kid.id,
  name: kid.name,
  role: 'child'
});

// Provider component for authentication context
export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const kidsContext = useContext(KidsContext);
  const [userMap, setUserMap] = useState<Record<string, User>>(STATIC_USERS);
  const [user, setUser] = useState<User | null>(null);

  // Update userMap whenever kids change
  useEffect(() => {
    if (kidsContext) {
      const { kids } = kidsContext.state;
      
      // Create a new user map with static users and kids converted to users
      const newUserMap: Record<string, User> = { ...STATIC_USERS };
      
      // Add kids as users
      kids.forEach(kid => {
        newUserMap[kid.id] = kidToUser(kid);
      });
      
      setUserMap(newUserMap);
      
      // If the current user was deleted, log out
      if (user && user.role === 'child' && !newUserMap[user.id]) {
        setUser(null);
      }
    }
  }, [kidsContext?.state.kids, user]);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedUserId = localStorage.getItem(USER_STORAGE_KEY);
      
      if (initialUser && userMap[initialUser]) {
        // Use initialUser if specified
        setUser(userMap[initialUser]);
      } else if (storedUserId && userMap[storedUserId]) {
        // Load user from storage
        setUser(userMap[storedUserId]);
      } else if (kidsContext?.state.selectedKidId && userMap[kidsContext.state.selectedKidId]) {
        // Use selected kid if available
        setUser(userMap[kidsContext.state.selectedKidId]);
      } else {
        // Default to the teacher user
        setUser(STATIC_USERS['teacher789']);
      }
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
      // Default to the teacher user on error
      setUser(STATIC_USERS['teacher789']);
    }
  }, [initialUser, userMap, kidsContext?.state.selectedKidId]);

  const login = (userId: string): boolean => {
    if (userMap[userId]) {
      setUser(userMap[userId]);
      
      // Save to localStorage
      localStorage.setItem(USER_STORAGE_KEY, userId);
      
      // If user is a kid, also select them in the KidsContext
      if (userMap[userId].role === 'child' && kidsContext) {
        kidsContext.selectKid(userId);
      }
      
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  const getUsers = (): User[] => Object.values(userMap);
  
  const getChildUsers = (): User[] => Object.values(userMap).filter(u => u.role === 'child');

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    getUsers,
    getChildUsers
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

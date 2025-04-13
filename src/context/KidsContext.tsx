import React, { createContext, useReducer, ReactNode, useContext, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Kid, KidsState, KidAction, KidsContextType } from '../types/kid';
import { generateMockDataForKid } from '../lib/mockDataGenerator';
import { debounce } from '../utils/debounce';
import { secureLocalStorage } from '../utils/encryption';

// Local storage key
const KIDS_STORAGE_KEY = 'app_kids_data';
const SELECTED_KID_KEY = 'app_selected_kid';

// Default kids for empty state
const DEFAULT_KIDS: Kid[] = [
  {
    id: 'child123',
    name: 'Emma',
    age: 6,
    createdAt: new Date('2023-10-01'),
    updatedAt: new Date('2023-10-01')
  },
  {
    id: 'child456',
    name: 'Noah',
    age: 7,
    createdAt: new Date('2023-10-01'),
    updatedAt: new Date('2023-10-01')
  }
];

// Initial state
const initialState: KidsState = {
  kids: [],
  selectedKidId: null,
  isLoading: false,
  error: null
};

// Reducer function
function kidsReducer(state: KidsState, action: KidAction): KidsState {
  switch (action.type) {
    case 'ADD_KID':
      return {
        ...state,
        kids: [...state.kids, action.payload],
        selectedKidId: action.payload.id, // Auto-select newly added kid
        error: null
      };
    case 'UPDATE_KID':
      return {
        ...state,
        kids: state.kids.map(kid => 
          kid.id === action.payload.id ? { ...kid, ...action.payload, updatedAt: new Date() } : kid
        ),
        error: null
      };
    case 'DELETE_KID':
      return {
        ...state,
        kids: state.kids.filter(kid => kid.id !== action.payload),
        // If the deleted kid was selected, select another one or null
        selectedKidId: state.selectedKidId === action.payload 
          ? (state.kids.length > 1 ? state.kids.find(k => k.id !== action.payload)?.id || null : null) 
          : state.selectedKidId,
        error: null
      };
    case 'SELECT_KID':
      return {
        ...state,
        selectedKidId: action.payload,
        error: null
      };
    case 'SET_KIDS':
      return {
        ...state,
        kids: action.payload,
        error: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    default:
      return state;
  }
}

// Create context
export const KidsContext = createContext<KidsContextType | undefined>(undefined);

// Provider component props
interface KidsProviderProps {
  children: ReactNode;
}

// Provider component
export function KidsProvider({ children }: KidsProviderProps) {
  const [state, dispatch] = useReducer(kidsReducer, initialState);

  // Debounced function to save data to secure storage
  // This avoids excessive writes to localStorage when state changes rapidly
  const saveToStorage = useCallback(
    debounce((kids: Kid[], selectedKidId: string | null) => {
      try {
        if (kids.length > 0) {
          secureLocalStorage.setItem(KIDS_STORAGE_KEY, kids);
        }
        
        if (selectedKidId) {
          secureLocalStorage.setItem(SELECTED_KID_KEY, selectedKidId);
        } else {
          secureLocalStorage.removeItem(SELECTED_KID_KEY);
        }
      } catch (error) {
        console.error('Error saving to secure storage:', error);
      }
    }, 300), // 300ms debounce time
    []
  );

  // Load kids from secure storage on mount
  useEffect(() => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const storedKids = secureLocalStorage.getItem<Kid[]>(KIDS_STORAGE_KEY);
      const storedSelectedKid = secureLocalStorage.getItem<string>(SELECTED_KID_KEY);
      
      let parsedKids: Kid[] = [];
      
      if (storedKids) {
        // Process dates - they come as strings from JSON
        parsedKids = storedKids.map((kid: any) => ({
          ...kid,
          createdAt: new Date(kid.createdAt),
          updatedAt: new Date(kid.updatedAt)
        }));
      } else {
        // No kids in storage, use default ones
        parsedKids = DEFAULT_KIDS;
        secureLocalStorage.setItem(KIDS_STORAGE_KEY, DEFAULT_KIDS);
        
        // Generate mock emotion data for default kids
        DEFAULT_KIDS.forEach(kid => {
          generateMockDataForKid(kid.id, kid.name)
            .catch(err => console.error(`Failed to generate mock data for ${kid.name}:`, err));
        });
      }
      
      dispatch({ type: 'SET_KIDS', payload: parsedKids });
      
      if (storedSelectedKid && parsedKids.some((k: Kid) => k.id === storedSelectedKid)) {
        dispatch({ type: 'SELECT_KID', payload: storedSelectedKid });
      } else if (parsedKids.length > 0) {
        // Auto-select the first kid if none is selected
        dispatch({ type: 'SELECT_KID', payload: parsedKids[0].id });
      }
    } catch (error) {
      console.error('Error loading kids from secure storage:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load saved kids' });
      
      // Fallback to default kids on error
      dispatch({ type: 'SET_KIDS', payload: DEFAULT_KIDS });
      if (DEFAULT_KIDS.length > 0) {
        dispatch({ type: 'SELECT_KID', payload: DEFAULT_KIDS[0].id });
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Save kids to secure storage whenever they change
  // Now using the debounced function
  useEffect(() => {
    saveToStorage(state.kids, state.selectedKidId);
  }, [state.kids, state.selectedKidId, saveToStorage]);

  // CRUD operations
  const addKid = async (kidData: Omit<Kid, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const now = new Date();
      const newKid: Kid = {
        ...kidData,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now
      };
      
      dispatch({ type: 'ADD_KID', payload: newKid });
      
      // Generate mock emotion data for the new kid
      try {
        await generateMockDataForKid(newKid.id, newKid.name);
        console.log(`Mock data generated for ${newKid.name}`);
      } catch (error) {
        console.error(`Failed to generate mock data for ${newKid.name}:`, error);
        // Don't prevent kid creation if mock data generation fails
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Error adding kid:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add kid' });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateKid = async (kidData: Partial<Kid> & { id: string }) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const existingKid = state.kids.find(k => k.id === kidData.id);
      if (!existingKid) {
        throw new Error('Kid not found');
      }
      
      // Create a complete Kid object by merging with existing data
      const updatedKid: Kid = {
        ...existingKid,
        ...kidData,
        updatedAt: new Date()
      };
      
      dispatch({ type: 'UPDATE_KID', payload: updatedKid });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      console.error('Error updating kid:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update kid' });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteKid = async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const existingKid = state.kids.find(k => k.id === id);
      if (!existingKid) {
        throw new Error('Kid not found');
      }
      
      dispatch({ type: 'DELETE_KID', payload: id });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      console.error('Error deleting kid:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete kid' });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const selectKid = (id: string) => {
    const kidExists = state.kids.some(k => k.id === id);
    if (kidExists) {
      dispatch({ type: 'SELECT_KID', payload: id });
    } else {
      console.error('Cannot select non-existent kid');
    }
  };

  const value: KidsContextType = {
    state,
    addKid,
    updateKid,
    deleteKid,
    selectKid
  };

  return (
    <KidsContext.Provider value={value}>
      {children}
    </KidsContext.Provider>
  );
}

// Custom hook for accessing the context
export function useKids() {
  const context = useContext(KidsContext);
  if (context === undefined) {
    throw new Error('useKids must be used within a KidsProvider');
  }
  return context;
} 
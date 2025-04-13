import React, { createContext, useReducer, ReactNode, useContext, useEffect, useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  ILP, ILPState, ILPAction, ILPContextType, ILPStatus, 
  ActivityType, ILPProgress, Objective, ApprovalStatus 
} from '../types/ilp';
import { debounce } from '../utils/debounce';
import { secureLocalStorage } from '../utils/encryption';
import { useKids } from './KidsContext';
import { ILPProgressService } from '../services/ILPProgressService';

// Local storage keys
const ILPS_STORAGE_KEY = 'app_ilps_data';
const SELECTED_ILP_KEY = 'app_selected_ilp';
const ILP_MODE_KEY = 'app_ilp_mode_active';

// Initial state
const initialState: ILPState = {
  ilps: [],
  selectedIlpId: null,
  isLoading: false,
  error: null
};

// Reducer function
function ilpReducer(state: ILPState, action: ILPAction): ILPState {
  switch (action.type) {
    case 'ADD_ILP':
      return {
        ...state,
        ilps: [...state.ilps, action.payload],
        selectedIlpId: action.payload.id, // Auto-select newly added ILP
        error: null
      };
    case 'UPDATE_ILP':
      return {
        ...state,
        ilps: state.ilps.map(ilp => 
          ilp.id === action.payload.id ? { ...ilp, ...action.payload, updatedAt: new Date() } : ilp
        ),
        error: null
      };
    case 'DELETE_ILP':
      return {
        ...state,
        ilps: state.ilps.filter(ilp => ilp.id !== action.payload),
        // If the deleted ILP was selected, select another one or null
        selectedIlpId: state.selectedIlpId === action.payload 
          ? (state.ilps.length > 1 ? state.ilps.find(i => i.id !== action.payload)?.id || null : null) 
          : state.selectedIlpId,
        error: null
      };
    case 'SELECT_ILP':
      return {
        ...state,
        selectedIlpId: action.payload,
        error: null
      };
    case 'SET_ILPS':
      return {
        ...state,
        ilps: action.payload,
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

// Extended ILP Context Type with new features
export interface ExtendedILPContextType extends ILPContextType {
  ilpModeActive: boolean;
  toggleILPMode: () => void;
  getProgressForILP: (ilpId: string) => Promise<ILPProgress[]>;
  getOverallProgress: (ilpId: string) => Promise<number>;
  recordProgress: (progressData: Omit<ILPProgress, 'id' | 'timestamp' | 'progressPercentageContribution'>) => Promise<ILPProgress>;
  addObjectiveToILP: (ilpId: string, objective: Omit<Objective, 'id'>) => Promise<void>;
  updateObjective: (ilpId: string, objectiveId: string, updates: Partial<Objective>) => Promise<void>;
  removeObjectiveFromILP: (ilpId: string, objectiveId: string) => Promise<void>;
  getILPsBySkill: (skill: string) => ILP[];
  getActiveILPs: () => ILP[];
  getRelevantILPsForActivity: (activityType: ActivityType, skill?: string) => ILP[];
}

// Create context
export const ILPContext = createContext<ExtendedILPContextType | undefined>(undefined);

// Provider component props
interface ILPProviderProps {
  children: ReactNode;
}

// Provider component with enhanced functionality
export function ILPProvider({ children }: ILPProviderProps) {
  const [state, dispatch] = useReducer(ilpReducer, initialState);
  const { state: kidsState } = useKids();
  const [ilpModeActive, setIlpModeActive] = useState<boolean>(
    secureLocalStorage.getItem<boolean>(ILP_MODE_KEY) || false
  );

  // Debounced function to save data to secure storage
  const saveToStorage = useCallback(
    debounce((ilps: ILP[], selectedIlpId: string | null) => {
      try {
        if (ilps.length > 0) {
          secureLocalStorage.setItem(ILPS_STORAGE_KEY, ilps);
        }
        
        if (selectedIlpId) {
          secureLocalStorage.setItem(SELECTED_ILP_KEY, selectedIlpId);
        } else {
          secureLocalStorage.removeItem(SELECTED_ILP_KEY);
        }
      } catch (error) {
        console.error('Error saving ILPs to secure storage:', error);
      }
    }, 300), // 300ms debounce time
    []
  );

  // Toggle ILP Mode
  const toggleILPMode = () => {
    const newMode = !ilpModeActive;
    setIlpModeActive(newMode);
    secureLocalStorage.setItem(ILP_MODE_KEY, newMode);
  };

  // Filter ILPs based on selected kid
  const getFilteredIlps = useCallback(() => {
    if (!kidsState.selectedKidId) return [];
    return state.ilps.filter(ilp => ilp.childId === kidsState.selectedKidId);
  }, [state.ilps, kidsState.selectedKidId]);

  // Load ILPs from secure storage on mount
  useEffect(() => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const storedIlps = secureLocalStorage.getItem<ILP[]>(ILPS_STORAGE_KEY);
      const storedSelectedIlp = secureLocalStorage.getItem<string>(SELECTED_ILP_KEY);
      
      let parsedIlps: ILP[] = [];
      
      if (storedIlps) {
        // Process dates - they come as strings from JSON
        parsedIlps = storedIlps.map((ilp: any) => ({
          ...ilp,
          timeframeStart: new Date(ilp.timeframeStart),
          timeframeEnd: new Date(ilp.timeframeEnd),
          createdAt: new Date(ilp.createdAt),
          updatedAt: new Date(ilp.updatedAt)
        }));
      }
      
      dispatch({ type: 'SET_ILPS', payload: parsedIlps });
      
      if (storedSelectedIlp && parsedIlps.some((i: ILP) => i.id === storedSelectedIlp)) {
        dispatch({ type: 'SELECT_ILP', payload: storedSelectedIlp });
      }
    } catch (error) {
      console.error('Error loading ILPs from secure storage:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load saved ILPs' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Update selected ILP when selected kid changes
  useEffect(() => {
    const filteredIlps = getFilteredIlps();
    // If we have ILPs for this kid and none is selected, select the first one
    if (filteredIlps.length > 0 && (!state.selectedIlpId || !filteredIlps.some(ilp => ilp.id === state.selectedIlpId))) {
      dispatch({ type: 'SELECT_ILP', payload: filteredIlps[0].id });
    } else if (filteredIlps.length === 0) {
      // No ILPs for this kid, clear selection
      dispatch({ type: 'SELECT_ILP', payload: null });
    }
  }, [kidsState.selectedKidId, getFilteredIlps, state.selectedIlpId]);

  // Save ILPs to secure storage whenever they change
  useEffect(() => {
    saveToStorage(state.ilps, state.selectedIlpId);
  }, [state.ilps, state.selectedIlpId, saveToStorage]);

  // CRUD operations
  const addIlp = async (ilpData: Omit<ILP, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const now = new Date();
      const newIlp: ILP = {
        ...ilpData,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now,
        objectives: ilpData.objectives || [],
        approvalStatus: ilpData.approvalStatus || 'pending'
      };
      
      dispatch({ type: 'ADD_ILP', payload: newIlp });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      console.error('Error adding ILP:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add ILP' });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateIlp = async (ilpData: Partial<ILP> & { id: string }) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const existingIlp = state.ilps.find(i => i.id === ilpData.id);
      if (!existingIlp) {
        throw new Error('ILP not found');
      }
      
      // Create a complete ILP object by merging with existing data
      const updatedIlp: ILP = {
        ...existingIlp,
        ...ilpData,
        updatedAt: new Date()
      };
      
      dispatch({ type: 'UPDATE_ILP', payload: updatedIlp });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      console.error('Error updating ILP:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update ILP' });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteIlp = async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const existingIlp = state.ilps.find(i => i.id === id);
      if (!existingIlp) {
        throw new Error('ILP not found');
      }
      
      dispatch({ type: 'DELETE_ILP', payload: id });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      console.error('Error deleting ILP:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete ILP' });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const selectIlp = (id: string) => {
    const ilpExists = state.ilps.some(i => i.id === id);
    if (ilpExists) {
      dispatch({ type: 'SELECT_ILP', payload: id });
    } else {
      console.error('Cannot select non-existent ILP');
    }
  };

  // Objective management
  const addObjectiveToILP = async (ilpId: string, objective: Omit<Objective, 'id'>) => {
    try {
      const existingIlp = state.ilps.find(i => i.id === ilpId);
      if (!existingIlp) {
        throw new Error('ILP not found');
      }
      
      const newObjective: Objective = {
        ...objective,
        id: uuidv4(),
      };
      
      const updatedObjectives = [...(existingIlp.objectives || []), newObjective];
      
      await updateIlp({
        id: ilpId,
        objectives: updatedObjectives
      });
    } catch (error) {
      console.error('Error adding objective to ILP:', error);
      throw error;
    }
  };
  
  const updateObjective = async (ilpId: string, objectiveId: string, updates: Partial<Objective>) => {
    try {
      const existingIlp = state.ilps.find(i => i.id === ilpId);
      if (!existingIlp || !existingIlp.objectives) {
        throw new Error('ILP or objectives not found');
      }
      
      const updatedObjectives = existingIlp.objectives.map(obj => 
        obj.id === objectiveId ? { ...obj, ...updates } : obj
      );
      
      await updateIlp({
        id: ilpId,
        objectives: updatedObjectives
      });
    } catch (error) {
      console.error('Error updating objective:', error);
      throw error;
    }
  };
  
  const removeObjectiveFromILP = async (ilpId: string, objectiveId: string) => {
    try {
      const existingIlp = state.ilps.find(i => i.id === ilpId);
      if (!existingIlp || !existingIlp.objectives) {
        throw new Error('ILP or objectives not found');
      }
      
      const updatedObjectives = existingIlp.objectives.filter(obj => obj.id !== objectiveId);
      
      await updateIlp({
        id: ilpId,
        objectives: updatedObjectives
      });
    } catch (error) {
      console.error('Error removing objective from ILP:', error);
      throw error;
    }
  };

  // Progress tracking
  const getProgressForILP = async (ilpId: string): Promise<ILPProgress[]> => {
    return ILPProgressService.getProgressByILP(ilpId);
  };
  
  const getOverallProgress = async (ilpId: string): Promise<number> => {
    return ILPProgressService.getOverallProgress(ilpId);
  };
  
  const recordProgress = async (
    progressData: Omit<ILPProgress, 'id' | 'timestamp' | 'progressPercentageContribution'>
  ): Promise<ILPProgress> => {
    return ILPProgressService.recordProgress(progressData);
  };

  // Filter functions
  const getILPsBySkill = (skill: string): ILP[] => {
    return state.ilps.filter(ilp => ilp.targetSkill === skill);
  };
  
  const getActiveILPs = (): ILP[] => {
    return state.ilps.filter(ilp => ilp.status === 'active');
  };
  
  const getRelevantILPsForActivity = (activityType: ActivityType, skill?: string): ILP[] => {
    return state.ilps.filter(ilp => {
      // Must be active
      if (ilp.status !== 'active') return false;
      
      // Must include the activity type in preferred activities
      if (!ilp.preferredActivityTypes.includes(activityType)) return false;
      
      // If skill is provided, must match the ILP target skill
      if (skill && ilp.targetSkill !== skill) return false;
      
      // If the current user has a selected kid, ILP must be for that kid
      if (kidsState.selectedKidId && ilp.childId !== kidsState.selectedKidId) return false;
      
      return true;
    });
  };

  const value: ExtendedILPContextType = {
    state,
    addIlp,
    updateIlp,
    deleteIlp,
    selectIlp,
    ilpModeActive,
    toggleILPMode,
    getProgressForILP,
    getOverallProgress,
    recordProgress,
    addObjectiveToILP,
    updateObjective,
    removeObjectiveFromILP,
    getILPsBySkill,
    getActiveILPs,
    getRelevantILPsForActivity
  };

  return (
    <ILPContext.Provider value={value}>
      {children}
    </ILPContext.Provider>
  );
}

// Custom hook to use the ILP context
export function useIlps() {
  const context = useContext(ILPContext);
  if (!context) {
    throw new Error('useIlps must be used within an ILPProvider');
  }
  return context;
} 
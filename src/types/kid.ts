export interface Kid {
  id: string;
  name: string;
  age?: number;
  grade?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface KidsState {
  kids: Kid[];
  selectedKidId: string | null;
  isLoading: boolean;
  error: string | null;
}

export type KidAction =
  | { type: 'ADD_KID'; payload: Kid }
  | { type: 'UPDATE_KID'; payload: Kid }
  | { type: 'DELETE_KID'; payload: string }
  | { type: 'SELECT_KID'; payload: string }
  | { type: 'SET_KIDS'; payload: Kid[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

export interface KidsContextType {
  state: KidsState;
  addKid: (kid: Omit<Kid, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateKid: (kid: Partial<Kid> & { id: string }) => Promise<void>;
  deleteKid: (id: string) => Promise<void>;
  selectKid: (id: string) => void;
} 
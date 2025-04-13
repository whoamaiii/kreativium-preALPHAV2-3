export type AACCategory = 
  | 'basic_needs'
  | 'actions'
  | 'feelings'
  | 'people'
  | 'places'
  | 'objects'
  | 'time'
  | 'questions'
  | 'custom';

export interface AACSymbol {
  id: string;
  text: string;
  imageUrl: string;
  audioUrl?: string;
  category: AACCategory;
  sortOrder: number;
  isActive: boolean;
  isCustom: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface AACBoard {
  id: string;
  userId: string;
  name: string;
  description?: string;
  symbols: AACSymbol[];
  layout: AACLayout;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  isDefault: boolean;
}

export interface AACLayout {
  rows: number;
  columns: number;
  cellSize: 'small' | 'medium' | 'large';
  symbolPlacement: AACSymbolPlacement[];
}

export interface AACSymbolPlacement {
  symbolId: string;
  row: number;
  column: number;
  spanRows?: number;
  spanColumns?: number;
}

export interface AACPhrase {
  id: string;
  userId: string;
  symbols: AACSymbol[];
  text: string;
  createdAt: string; // ISO date string
  isCustom: boolean;
}

export interface AACSettings {
  userId: string;
  defaultBoardId: string;
  showTextWithSymbols: boolean;
  showRecentPhrases: boolean;
  maxRecentPhrases: number;
  symbolSize: 'small' | 'medium' | 'large';
  voiceSettings: {
    voice: string;
    rate: number;
    pitch: number;
    volume: number;
  };
} 
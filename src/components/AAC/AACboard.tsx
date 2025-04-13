import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Define symbol categories and symbols
interface Symbol {
  id: string;
  label: string;
  imageUrl: string;
  category: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

// Default categories
const defaultCategories: Category[] = [
  { id: 'needs', name: 'Behov', color: 'bg-red-600' },
  { id: 'actions', name: 'Handlinger', color: 'bg-blue-600' },
  { id: 'feelings', name: 'Følelser', color: 'bg-yellow-600' },
  { id: 'people', name: 'Personer', color: 'bg-green-600' },
  { id: 'places', name: 'Steder', color: 'bg-purple-600' },
  { id: 'objects', name: 'Objekter', color: 'bg-orange-600' },
];

// Sample symbols - in production, this would likely come from a database or API
const defaultSymbols: Symbol[] = [
  // Needs
  { id: 'hungry', label: 'Sulten', imageUrl: '/symbols/hungry.svg', category: 'needs' },
  { id: 'thirsty', label: 'Tørst', imageUrl: '/symbols/placeholder.svg', category: 'needs' },
  { id: 'tired', label: 'Trøtt', imageUrl: '/symbols/placeholder.svg', category: 'needs' },
  { id: 'bathroom', label: 'Toalett', imageUrl: '/symbols/placeholder.svg', category: 'needs' },
  { id: 'help', label: 'Hjelp', imageUrl: '/symbols/help.svg', category: 'needs' },
  
  // Actions
  { id: 'play', label: 'Leke', imageUrl: '/symbols/play.svg', category: 'actions' },
  { id: 'read', label: 'Lese', imageUrl: '/symbols/placeholder.svg', category: 'actions' },
  { id: 'draw', label: 'Tegne', imageUrl: '/symbols/placeholder.svg', category: 'actions' },
  { id: 'eat', label: 'Spise', imageUrl: '/symbols/placeholder.svg', category: 'actions' },
  { id: 'drink', label: 'Drikke', imageUrl: '/symbols/placeholder.svg', category: 'actions' },
  
  // Feelings
  { id: 'happy', label: 'Glad', imageUrl: '/symbols/happy.svg', category: 'feelings' },
  { id: 'sad', label: 'Trist', imageUrl: '/symbols/placeholder.svg', category: 'feelings' },
  { id: 'angry', label: 'Sint', imageUrl: '/symbols/placeholder.svg', category: 'feelings' },
  { id: 'scared', label: 'Redd', imageUrl: '/symbols/placeholder.svg', category: 'feelings' },
  { id: 'excited', label: 'Begeistret', imageUrl: '/symbols/placeholder.svg', category: 'feelings' },
  
  // Add more symbols for other categories as needed
];

// For demo/fallback, we'll use colored rectangles when images aren't available
const SymbolPlaceholder: React.FC<{ label: string, color: string }> = ({ label, color }) => (
  <div className={`${color} w-full h-24 rounded-lg flex items-center justify-center`}>
    <span className="text-white font-bold text-center px-2">{label}</span>
  </div>
);

interface AACboardProps {
  onSelect?: (symbol: Symbol) => void;
  customSymbols?: Symbol[];
  customCategories?: Category[];
}

export const AACboard: React.FC<AACboardProps> = ({ 
  onSelect,
  customSymbols,
  customCategories
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>('needs');
  const [sentence, setSentence] = useState<Symbol[]>([]);
  const [categories] = useState<Category[]>(customCategories || defaultCategories);
  const [symbols] = useState<Symbol[]>(customSymbols || defaultSymbols);

  // Filter symbols by selected category
  const filteredSymbols = selectedCategory
    ? symbols.filter(symbol => symbol.category === selectedCategory)
    : symbols;

  // Add a symbol to the sentence
  const addToSentence = (symbol: Symbol) => {
    setSentence([...sentence, symbol]);
    if (onSelect) {
      onSelect(symbol);
    }
  };

  // Clear the sentence
  const clearSentence = () => {
    setSentence([]);
  };

  // Speak the sentence using speech synthesis
  const speakSentence = () => {
    if (sentence.length === 0) return;
    
    const text = sentence.map(symbol => symbol.label).join(' ');
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'nb-NO'; // Norwegian
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-lg overflow-hidden">
      {/* Sentence display */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex flex-wrap gap-2 min-h-16 items-center">
          {sentence.length > 0 ? (
            <>
              {sentence.map((symbol, index) => (
                <div key={`${symbol.id}-${index}`} className="flex flex-col items-center">
                  <div className="w-12 h-12 relative">
                    {symbol.imageUrl ? (
                      <img 
                        src={symbol.imageUrl} 
                        alt={symbol.label}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          // Find next sibling and show it
                          const parent = target.parentElement;
                          if (parent && parent.nextElementSibling) {
                            (parent.nextElementSibling as HTMLElement).style.display = 'flex';
                          }
                        }}
                      />
                    ) : (
                      <SymbolPlaceholder 
                        label={symbol.label} 
                        color={categories.find(c => c.id === symbol.category)?.color || 'bg-gray-500'} 
                      />
                    )}
                  </div>
                  <span className="text-xs text-white mt-1">{symbol.label}</span>
                </div>
              ))}
            </>
          ) : (
            <p className="text-gray-400 text-center w-full">Velg symboler for å bygge en setning</p>
          )}
        </div>
        
        {sentence.length > 0 && (
          <div className="flex justify-end mt-4 space-x-2">
            <button 
              onClick={clearSentence}
              className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
            >
              Tøm
            </button>
            <button 
              onClick={speakSentence}
              className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
            >
              Les opp
            </button>
          </div>
        )}
      </div>

      {/* Category selector */}
      <div className="flex p-2 bg-gray-800 border-b border-gray-700 overflow-x-auto">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 mx-1 rounded-md text-white text-sm whitespace-nowrap transition-colors ${
              selectedCategory === category.id
                ? `${category.color} shadow-lg`
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Symbols grid */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <AnimatePresence mode="wait">
            {filteredSymbols.map(symbol => (
              <motion.div
                key={symbol.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center"
                onClick={() => addToSentence(symbol)}
              >
                <div className="w-full aspect-square bg-gray-800 rounded-lg p-2 cursor-pointer hover:bg-gray-700 transition-colors">
                  {symbol.imageUrl ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={symbol.imageUrl} 
                        alt={symbol.label}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            const category = symbols.find(s => s.id === symbol.id)?.category || '';
                            const categoryColor = categories.find(c => c.id === category)?.color || 'bg-gray-500';
                            
                            // Create placeholder
                            const placeholder = document.createElement('div');
                            placeholder.className = `${categoryColor} w-full h-full rounded-lg flex items-center justify-center`;
                            placeholder.innerHTML = `<span class="text-white font-bold text-center px-2">${symbol.label}</span>`;
                            
                            parent.appendChild(placeholder);
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <SymbolPlaceholder 
                      label={symbol.label} 
                      color={categories.find(c => c.id === symbol.category)?.color || 'bg-gray-500'} 
                    />
                  )}
                </div>
                <span className="text-xs text-white mt-2">{symbol.label}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AACboard; 
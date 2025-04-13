import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Users, Plus } from 'lucide-react';
import { useKids } from '../context/KidsContext';
import { Kid } from '../types/kid';

export const KidSelector: React.FC = () => {
  const { state, selectKid } = useKids();
  const [isOpen, setIsOpen] = useState(false);

  const selectedKid = state.kids.find(kid => kid.id === state.selectedKidId);

  const handleSelectKid = (kid: Kid) => {
    selectKid(kid.id);
    setIsOpen(false);
  };

  if (state.kids.length === 0) {
    return (
      <Link to="/kids" className="flex items-center gap-1.5 text-white hover:text-purple-300 transition">
        <Plus className="w-4 h-4" />
        <span className="text-sm">Legg til barn</span>
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 bg-purple-600/30 px-3 py-1.5 rounded-full hover:bg-purple-600/40 transition text-white"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
          {selectedKid?.avatarUrl ? (
            <img
              src={selectedKid.avatarUrl}
              alt={selectedKid.name}
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <span className="text-xs font-semibold text-purple-700">
              {selectedKid?.name.charAt(0).toUpperCase() || '?'}
            </span>
          )}
        </div>
        <span className="text-sm font-medium">{selectedKid?.name || 'Velg barn'}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div
          className="absolute top-full right-0 mt-1 w-56 bg-gray-800 rounded-md shadow-lg z-50"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="kid-selector"
        >
          <div className="py-1">
            {state.kids.map(kid => (
              <button
                key={kid.id}
                className={`flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-700 transition ${
                  kid.id === state.selectedKidId ? 'bg-purple-600/20' : ''
                }`}
                onClick={() => handleSelectKid(kid)}
                role="menuitem"
              >
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                  {kid.avatarUrl ? (
                    <img
                      src={kid.avatarUrl}
                      alt={kid.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-semibold text-purple-700">
                      {kid.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="text-sm text-white">{kid.name}</span>
              </button>
            ))}
            
            <div className="border-t border-gray-700 my-1"></div>

            <Link
              to="/kids"
              className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-700 transition"
              onClick={() => setIsOpen(false)}
              role="menuitem"
            >
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">Administrer barn</span>
            </Link>
          </div>
        </div>
      )}

      {/* Backdrop to close menu when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        ></div>
      )}
    </div>
  );
}; 
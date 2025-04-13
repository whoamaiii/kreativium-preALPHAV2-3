import React from 'react';
import { Brain, Gamepad2, HandMetal, BookOpen, Plus } from 'lucide-react';
import { Card } from './Card';

interface LandingPageProps {
  onSelectMode: (mode: 'quiz' | 'memory' | 'practice' | 'custom') => void;
  onOpenDictionary: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectMode, onOpenDictionary }) => {
  return (
    <div className="space-y-12">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <Card
          className="text-center p-8 hover:scale-105 transform transition-all cursor-pointer group dark:bg-dark-secondary"
          onClick={() => onSelectMode('quiz')}
        >
          <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-indigo-500 group-hover:text-indigo-600 transition-colors" />
          <h2 className="text-2xl font-bold mb-2 dark:text-white">Quiz</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Test dine kunnskaper i tegnspråk gjennom morsomme spørsmål
          </p>
        </Card>

        <Card
          className="text-center p-8 hover:scale-105 transform transition-all cursor-pointer group dark:bg-dark-secondary"
          onClick={() => onSelectMode('memory')}
        >
          <Brain className="w-16 h-16 mx-auto mb-4 text-purple-500 group-hover:text-purple-600 transition-colors" />
          <h2 className="text-2xl font-bold mb-2 dark:text-white">Memory</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Finn matchende tegn i et klassisk memory-spill
          </p>
        </Card>

        <Card
          className="text-center p-8 hover:scale-105 transform transition-all cursor-pointer group dark:bg-dark-secondary"
          onClick={() => onSelectMode('practice')}
        >
          <HandMetal className="w-16 h-16 mx-auto mb-4 text-pink-500 group-hover:text-pink-600 transition-colors" />
          <h2 className="text-2xl font-bold mb-2 dark:text-white">Øvelse</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Øv på tegnspråk i ditt eget tempo med detaljerte instruksjoner
          </p>
        </Card>

        <Card
          className="text-center p-8 hover:scale-105 transform transition-all cursor-pointer group dark:bg-dark-secondary"
          onClick={() => onSelectMode('custom')}
        >
          <Plus className="w-16 h-16 mx-auto mb-4 text-green-500 group-hover:text-green-600 transition-colors" />
          <h2 className="text-2xl font-bold mb-2 dark:text-white">Egne Quiz</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Lag og spill dine egne quizer med egne bilder og spørsmål
          </p>
        </Card>
      </div>

      <Card 
        className="text-center p-8 dark:bg-dark-secondary group hover:shadow-lg transition-all cursor-pointer"
        onClick={onOpenDictionary}
      >
        <BookOpen className="w-16 h-16 mx-auto mb-4 text-emerald-500 group-hover:text-emerald-600 transition-colors" />
        <h2 className="text-2xl font-bold mb-2 dark:text-white">Tegnordbok</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Utforsk den offisielle norske tegnordboken for å lære flere tegn
        </p>
        <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-medium group-hover:underline">
          Åpne Tegnordbok
          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </Card>
    </div>
  );
};
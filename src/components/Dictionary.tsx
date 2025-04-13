import React from 'react';
import { Card } from './Card';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from './Button';

interface DictionaryProps {
  onBack: () => void;
}

export const Dictionary: React.FC<DictionaryProps> = ({ onBack }) => {
  const openTegnordbok = () => {
    window.open('https://www.minetegn.no/Tegnordbok-2016/tegnordbok.php', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={onBack}
          className="group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="ml-2">Tilbake</span>
        </Button>
        <h2 className="text-2xl font-bold dark:text-white">Tegnordbok</h2>
      </div>

      <Card className="p-8 text-center space-y-6 dark:bg-dark-secondary">
        <h3 className="text-xl font-semibold dark:text-white">
          Offisiell Norsk Tegnordbok
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Utforsk den offisielle norske tegnordboken for å lære flere tegn. 
          Klikk på knappen under for å åpne tegnordboken i et nytt vindu.
        </p>

        <Button 
          onClick={openTegnordbok}
          className="group transform hover:scale-105 transition-all"
        >
          <span>Åpne Tegnordbok</span>
          <ExternalLink className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Card>
    </div>
  );
};
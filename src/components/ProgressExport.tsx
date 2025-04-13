import React from 'react';
import { Download, Upload } from 'lucide-react';
import { Button } from './Button';
import { useToast } from '../hooks/useToast';
import { GameState, GameStats } from '../types';

interface ProgressExportProps {
  gameState: GameState;
  gameStats: GameStats;
}

export const ProgressExport: React.FC<ProgressExportProps> = ({
  gameState,
  gameStats,
}) => {
  const { addToast } = useToast();

  const handleExport = () => {
    try {
      const data = {
        gameState,
        gameStats,
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };

      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ask123_progress_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addToast('Fremgang eksportert!', 'success');
    } catch (error) {
      addToast('Kunne ikke eksportere fremgang', 'error');
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // Validate the imported data
        if (!data.gameState || !data.gameStats || !data.version) {
          throw new Error('Invalid file format');
        }

        // Store the imported data
        localStorage.setItem('gameState', JSON.stringify(data.gameState));
        localStorage.setItem('gameStats', JSON.stringify(data.gameStats));
        
        addToast('Fremgang importert!', 'success');
        setTimeout(() => window.location.reload(), 1500);
      } catch {
        addToast('Kunne ikke importere fremgang', 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Button onClick={handleExport} className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Eksporter fremgang
        </Button>

        <label className="relative">
          <Button variant="secondary" className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Importer fremgang
          </Button>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
};
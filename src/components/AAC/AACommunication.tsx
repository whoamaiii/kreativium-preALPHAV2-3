import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AACboard from './AACboard';

export const AACommunication: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'communicate' | 'learn' | 'settings'>('communicate');

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Kommunikasjonstavle
        </h1>
        <p className="text-gray-400">
          Bruk symboler for å kommunisere enkelt og effektivt
        </p>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-gray-700 mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
            activeTab === 'communicate'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('communicate')}
        >
          Kommuniser
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
            activeTab === 'learn'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('learn')}
        >
          Lær tegn
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
            activeTab === 'settings'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('settings')}
        >
          Innstillinger
        </button>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        style={{ minHeight: '70vh' }}
      >
        {activeTab === 'communicate' && (
          <div className="h-full">
            <AACboard />
          </div>
        )}

        {activeTab === 'learn' && (
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-4">Lær tegn</h2>
            <p className="text-gray-400">
              Denne seksjonen vil inneholde læringsressurser for tegn-til-tale.
              Her kan du utforske og lære nye tegn gjennom interaktive øvelser.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Grunnleggende tegn</h3>
                <p className="text-gray-400 text-sm">Lær de mest brukte tegnene for hverdagskommunikasjon</p>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Tegn for skolen</h3>
                <p className="text-gray-400 text-sm">Tegn relatert til skoleaktiviteter og faguttrykk</p>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Tegn for følelser</h3>
                <p className="text-gray-400 text-sm">Uttrykk følelser og behov gjennom tegn</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-4">Innstillinger</h2>
            <p className="text-gray-400 mb-6">
              Tilpass kommunikasjonstavlen for å møte dine behov.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div>
                  <h3 className="font-medium text-white">Symbolstørrelse</h3>
                  <p className="text-sm text-gray-400">Juster størrelsen på symbolene</p>
                </div>
                <select className="bg-gray-800 text-white p-2 rounded-md border border-gray-600">
                  <option>Liten</option>
                  <option selected>Medium</option>
                  <option>Stor</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div>
                  <h3 className="font-medium text-white">Vis tekst under symboler</h3>
                  <p className="text-sm text-gray-400">Vis eller skjul tekst under symboler</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div>
                  <h3 className="font-medium text-white">Talesyntese</h3>
                  <p className="text-sm text-gray-400">Velg stemme for opplesing</p>
                </div>
                <select className="bg-gray-800 text-white p-2 rounded-md border border-gray-600">
                  <option>Norsk (kvinne)</option>
                  <option selected>Norsk (mann)</option>
                  <option>Barn</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AACommunication; 
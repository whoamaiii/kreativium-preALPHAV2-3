import React from 'react';
import { Search, Filter, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Form, FormInput, FormSelect } from '../../components/Form';
import { useDictionary } from '../../hooks/useDictionary';

const Dictionary: React.FC = () => {
  const {
    signs,
    isLoading,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortOrder,
    setSortOrder,
  } = useDictionary();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">Tegnordbok</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Utforsk og lær nye tegn fra vår omfattende samling
        </p>
      </div>

      <Card className="p-6 dark:bg-gray-800">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <FormInput
              name="search"
              placeholder="Søk etter tegn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <FormSelect
              name="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              options={[
                { value: 'all', label: 'Alle kategorier' },
                { value: 'farger', label: 'Farger' },
                { value: 'dyr', label: 'Dyr' },
                { value: 'daglig', label: 'Daglige uttrykk' },
              ]}
              className="w-40"
            />
            <Button
              variant="secondary"
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              {sortOrder === 'asc' ? 'A-Å' : 'Å-A'}
            </Button>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse h-80" />
          ))}
        </div>
      ) : signs.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {signs.map((sign, index) => (
            <motion.div
              key={sign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="overflow-hidden dark:bg-gray-800">
                <div className="aspect-square">
                  <img
                    src={sign.imageUrl}
                    alt={sign.word}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1 dark:text-white">
                    {sign.word}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {sign.description}
                  </p>
                  {sign.example && (
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 italic">
                      Eksempel: {sign.example}
                    </p>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2 dark:text-white">
            Ingen tegn funnet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Prøv å søke med andre ord eller velg en annen kategori
          </p>
        </Card>
      )}

      <Card className="p-6 text-center dark:bg-gray-800">
        <h3 className="text-lg font-semibold mb-2 dark:text-white">
          Vil du lære flere tegn?
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Besøk den offisielle norske tegnordboken for å utforske enda flere tegn
        </p>
        <Button
          onClick={() => window.open('https://www.minetegn.no/Tegnordbok-2016/', '_blank')}
          className="inline-flex items-center"
        >
          <span>Besøk Tegnordbok</span>
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </Card>
    </div>
  );
};

export default Dictionary;
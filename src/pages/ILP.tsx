import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const ILP: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">IOP - Individuell Opplæringsplan</h1>
      
      <Card className="p-6 mb-6 bg-gray-800">
        <h2 className="text-xl font-semibold text-white mb-4">Hva er en IOP?</h2>
        <p className="text-gray-300 mb-4">
          En Individuell Opplæringsplan (IOP) er en tilpasset utdanningsplan utformet for å hjelpe elever med å nå spesifikke læringsmål. 
          Den definerer målrettede ferdigheter, foretrukne læringsaktiviteter og sporer fremgang mot målene.
        </p>
        <div className="flex justify-end">
          <Button 
            variant="primary" 
            onClick={() => navigate('/ilp/management')}
            className="mt-4"
          >
            Gå til IOP Administrasjon
          </Button>
        </div>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 bg-gray-800">
          <h2 className="text-xl font-semibold text-white mb-4">Funksjoner</h2>
          <ul className="list-disc pl-5 text-gray-300 space-y-2">
            <li>Lag personlige læringsmål</li>
            <li>Spor fremgang med visuelle indikatorer</li>
            <li>Få aktivitetsanbefalinger basert på mål</li>
            <li>Generer fremgangsrapporter</li>
            <li>Sett tidsrammer for måloppnåelse</li>
          </ul>
        </Card>
        
        <Card className="p-6 bg-gray-800">
          <h2 className="text-xl font-semibold text-white mb-4">Kom i gang</h2>
          <ol className="list-decimal pl-5 text-gray-300 space-y-2">
            <li>Velg et barn fra barnevelgeren</li>
            <li>Gå til IOP Administrasjon</li>
            <li>Lag din første opplæringsplan</li>
            <li>Start anbefalte aktiviteter</li>
            <li>Overvåk fremgang på dashbordet</li>
          </ol>
        </Card>
      </div>
    </div>
  );
};

export default ILP; 
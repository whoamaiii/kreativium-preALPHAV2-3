import React, { useState } from 'react';
import { Users, Plus, Pencil, Trash2, CheckCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useKids } from '../context/KidsContext';
import { Kid } from '../types/kid';
import { useToast } from '../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import AACIcon from '../components/AAC/AACIcon';

// Internal components
interface KidFormData {
  name: string;
  age?: string;
  grade?: string;
}

const KidForm: React.FC<{
  initialData?: Partial<Kid>;
  onSubmit: (data: KidFormData) => void;
  onCancel: () => void;
}> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<KidFormData>({
    name: initialData?.name || '',
    age: initialData?.age ? String(initialData.age) : '',
    grade: initialData?.grade || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Navn *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
      
      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Alder
        </label>
        <input
          type="number"
          id="age"
          name="age"
          value={formData.age}
          onChange={handleChange}
          min="1"
          max="18"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
      
      <div>
        <label htmlFor="grade" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Klassetrinn
        </label>
        <input
          type="text"
          id="grade"
          name="grade"
          value={formData.grade}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Avbryt
        </Button>
        <Button type="submit" variant="primary">
          {initialData?.id ? 'Oppdater' : 'Legg til'}
        </Button>
      </div>
    </form>
  );
};

const KidCard: React.FC<{
  kid: Kid;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ kid, isSelected, onSelect, onEdit, onDelete }) => {
  return (
    <Card
      className={`p-4 cursor-pointer transition hover:shadow-md ${
        isSelected ? 'border-2 border-purple-500' : ''
      }`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
            {kid.avatarUrl ? (
              <img src={kid.avatarUrl} alt={kid.name} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <span className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                {kid.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-semibold dark:text-white">{kid.name}</h3>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {kid.age && `${kid.age} år`}
              {kid.age && kid.grade && ' • '}
              {kid.grade && `${kid.grade}. klasse`}
            </div>
          </div>
          {isSelected && (
            <CheckCircle className="w-5 h-5 text-purple-500 ml-2" />
          )}
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="text-gray-500 hover:text-purple-500"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-gray-500 hover:text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

const DeleteConfirmation: React.FC<{
  kidName: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ kidName, onConfirm, onCancel }) => {
  return (
    <div className="space-y-4">
      <p className="text-center text-gray-700 dark:text-gray-300">
        Er du sikker på at du vil slette <strong>{kidName}</strong>?
      </p>
      <p className="text-center text-sm text-red-500">
        Dette vil slette all data tilknyttet denne personen og kan ikke angres.
      </p>
      <div className="flex justify-center gap-3 mt-4">
        <Button variant="secondary" onClick={onCancel}>
          Avbryt
        </Button>
        <Button variant="primary" onClick={onConfirm} className="bg-red-500 hover:bg-red-600">
          Slett
        </Button>
      </div>
    </div>
  );
};

// Main component
const KidsManagement: React.FC = () => {
  const { state, addKid, updateKid, deleteKid, selectKid } = useKids();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'list' | 'add' | 'edit' | 'delete'>('list');
  const [selectedEditKid, setSelectedEditKid] = useState<Kid | null>(null);
  const [selectedDeleteKid, setSelectedDeleteKid] = useState<Kid | null>(null);

  const handleAddKid = (formData: KidFormData) => {
    const kidData = {
      name: formData.name,
      ...(formData.age ? { age: parseInt(formData.age, 10) } : {}),
      ...(formData.grade ? { grade: formData.grade } : {}),
    };

    addKid(kidData);
    addToast('Barn lagt til', 'success');
    setMode('list');
  };

  const handleUpdateKid = (formData: KidFormData) => {
    if (!selectedEditKid) return;
    
    const kidData = {
      id: selectedEditKid.id,
      name: formData.name,
      ...(formData.age ? { age: parseInt(formData.age, 10) } : {}),
      ...(formData.grade ? { grade: formData.grade } : {}),
    };

    updateKid(kidData);
    addToast('Barn oppdatert', 'success');
    setMode('list');
    setSelectedEditKid(null);
  };

  const handleDeleteKid = () => {
    if (!selectedDeleteKid) return;
    
    deleteKid(selectedDeleteKid.id);
    addToast('Barn slettet', 'success');
    setMode('list');
    setSelectedDeleteKid(null);
  };

  const startEditKid = (kid: Kid) => {
    setSelectedEditKid(kid);
    setMode('edit');
  };

  const startDeleteKid = (kid: Kid) => {
    setSelectedDeleteKid(kid);
    setMode('delete');
  };

  // Tool cards for the kid management page
  const toolCards = [
    {
      id: 'aac',
      title: 'Kommunikasjonstavle',
      description: 'Symbol-basert kommunikasjon for ikke-verbale barn',
      icon: AACIcon,
      color: 'text-teal-500',
      bgColor: 'bg-teal-500/10',
      onClick: () => navigate('/aac')
    },
    // Add more tools as needed
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Administrer barn</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Legg til og håndter barn i systemet
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setMode('add');
            setSelectedEditKid(null);
          }}
          disabled={mode !== 'list'}
        >
          <Plus className="w-4 h-4 mr-2" />
          Legg til barn
        </Button>
      </div>

      {mode === 'list' && (
        <>
          {state.kids.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {state.kids.map((kid) => (
                <KidCard
                  key={kid.id}
                  kid={kid}
                  isSelected={state.selectedKidId === kid.id}
                  onSelect={() => selectKid(kid.id)}
                  onEdit={() => startEditKid(kid)}
                  onDelete={() => startDeleteKid(kid)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg mt-4">
              <Users className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Ingen barn lagt til ennå</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Legg til barn for å begynne å registrere fremgang og aktiviteter.
              </p>
              <Button variant="primary" onClick={() => setMode('add')}>
                <Plus className="w-4 h-4 mr-2" />
                Legg til første barn
              </Button>
            </div>
          )}

          {/* Tools and Resources Section */}
          <div className="mt-12">
            <h2 className="text-xl font-bold dark:text-white mb-4">Verktøy og Ressurser</h2>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {toolCards.map((tool) => (
                <Card 
                  key={tool.id}
                  onClick={tool.onClick}
                  className={`p-6 cursor-pointer transition hover:shadow-md ${tool.bgColor} hover:bg-opacity-20`}
                >
                  <div className="flex flex-col items-center text-center">
                    <tool.icon className={`w-12 h-12 mb-4 ${tool.color}`} />
                    <h3 className="font-semibold text-lg dark:text-white mb-2">{tool.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{tool.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}

      {mode === 'add' && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Legg til barn</h2>
          <KidForm
            onSubmit={handleAddKid}
            onCancel={() => setMode('list')}
          />
        </Card>
      )}

      {mode === 'edit' && selectedEditKid && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Rediger barn</h2>
          <KidForm
            initialData={selectedEditKid}
            onSubmit={handleUpdateKid}
            onCancel={() => {
              setMode('list');
              setSelectedEditKid(null);
            }}
          />
        </Card>
      )}

      {mode === 'delete' && selectedDeleteKid && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-white text-center">Bekreft sletting</h2>
          <DeleteConfirmation
            kidName={selectedDeleteKid.name}
            onConfirm={handleDeleteKid}
            onCancel={() => {
              setMode('list');
              setSelectedDeleteKid(null);
            }}
          />
        </Card>
      )}
    </div>
  );
};

export default KidsManagement; 
import React, { useState, useEffect } from 'react';
import { Users, Plus, Pencil, Trash2, CheckCircle, Calendar, Target } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useIlps } from '../context/ILPContext';
import { useKids } from '../context/KidsContext';
import { ILP, TargetSkill, ILPStatus, ActivityType } from '../types/ilp';
import { useToast } from '../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import ILPDashboard from '../components/ILPDashboard';

// ILP Form Data Interface
interface ILPFormData {
  goalDescription: string;
  targetSkill: TargetSkill;
  timeframeStart: string;
  timeframeEnd: string;
  preferredActivityTypes: ActivityType[];
  accommodationsNotes?: string;
  status: ILPStatus;
}

// ILP Form Component
const ILPForm: React.FC<{
  initialData?: Partial<ILP>;
  onSubmit: (data: ILPFormData) => void;
  onCancel: () => void;
}> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<ILPFormData>({
    goalDescription: initialData?.goalDescription || '',
    targetSkill: initialData?.targetSkill || 'reading',
    timeframeStart: initialData?.timeframeStart ? format(initialData.timeframeStart, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    timeframeEnd: initialData?.timeframeEnd ? format(initialData.timeframeEnd, 'yyyy-MM-dd') : format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    preferredActivityTypes: initialData?.preferredActivityTypes || ['quiz'],
    accommodationsNotes: initialData?.accommodationsNotes || '',
    status: initialData?.status || 'active',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const activityType = name as ActivityType;
    
    setFormData((prev) => {
      if (checked && !prev.preferredActivityTypes.includes(activityType)) {
        return {
          ...prev,
          preferredActivityTypes: [...prev.preferredActivityTypes, activityType]
        };
      } else if (!checked && prev.preferredActivityTypes.includes(activityType)) {
        return {
          ...prev,
          preferredActivityTypes: prev.preferredActivityTypes.filter(type => type !== activityType)
        };
      }
      return prev;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="goalDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Mål Beskrivelse *
        </label>
        <textarea
          id="goalDescription"
          name="goalDescription"
          value={formData.goalDescription}
          onChange={handleChange}
          required
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
      
      <div>
        <label htmlFor="targetSkill" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Målferdighet *
        </label>
        <select
          id="targetSkill"
          name="targetSkill"
          value={formData.targetSkill}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="reading">Lesing</option>
          <option value="math">Matematikk</option>
          <option value="social">Sosiale ferdigheter</option>
          <option value="motor">Motoriske ferdigheter</option>
          <option value="language">Språk</option>
          <option value="cognitive">Kognitive ferdigheter</option>
          <option value="emotional">Emosjonell utvikling</option>
        </select>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="timeframeStart" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Startdato *
          </label>
          <input
            type="date"
            id="timeframeStart"
            name="timeframeStart"
            value={formData.timeframeStart}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        
        <div>
          <label htmlFor="timeframeEnd" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sluttdato *
          </label>
          <input
            type="date"
            id="timeframeEnd"
            name="timeframeEnd"
            value={formData.timeframeEnd}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Foretrukne aktivitetstyper *
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="activity-quiz"
              name="quiz"
              checked={formData.preferredActivityTypes.includes('quiz')}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="activity-quiz" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Quiz
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="activity-memory"
              name="memory"
              checked={formData.preferredActivityTypes.includes('memory')}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="activity-memory" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Memory
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="activity-exercise"
              name="exercise"
              checked={formData.preferredActivityTypes.includes('exercise')}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="activity-exercise" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Øvelse
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="activity-reading"
              name="reading"
              checked={formData.preferredActivityTypes.includes('reading')}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="activity-reading" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Lesing
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="activity-game"
              name="game"
              checked={formData.preferredActivityTypes.includes('game')}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="activity-game" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Spill
            </label>
          </div>
        </div>
      </div>
      
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Status *
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="active">Aktiv</option>
          <option value="achieved">Oppnådd</option>
          <option value="archived">Arkivert</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="accommodationsNotes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Tilretteleggingsnotater
        </label>
        <textarea
          id="accommodationsNotes"
          name="accommodationsNotes"
          value={formData.accommodationsNotes || ''}
          onChange={handleChange}
          rows={2}
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

// ILP Card Component
const ILPCard: React.FC<{
  ilp: ILP;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ ilp, isSelected, onSelect, onEdit, onDelete }) => {
  // Map skill names for display
  const skillNames: Record<TargetSkill, string> = {
    'reading': 'Lesing',
    'math': 'Matematikk',
    'social': 'Sosiale ferdigheter',
    'motor': 'Motoriske ferdigheter',
    'language': 'Språk',
    'cognitive': 'Kognitive ferdigheter',
    'emotional': 'Emosjonell utvikling'
  };

  // Map status names and colors
  const statusConfig: Record<ILPStatus, { name: string, color: string }> = {
    'active': { name: 'Aktiv', color: 'text-green-500' },
    'achieved': { name: 'Oppnådd', color: 'text-blue-500' },
    'archived': { name: 'Arkivert', color: 'text-gray-500' },
    'paused': { name: 'Pauset', color: 'text-amber-500' }
  };

  return (
    <Card
      className={`p-4 cursor-pointer transition hover:shadow-md ${
        isSelected ? 'border-2 border-purple-500' : ''
      }`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold dark:text-white flex items-center">
            {ilp.goalDescription.length > 60 
              ? `${ilp.goalDescription.substring(0, 60)}...` 
              : ilp.goalDescription}
            {isSelected && <CheckCircle className="w-5 h-5 text-purple-500 ml-2" />}
          </h3>
          
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Target className="w-4 h-4 mr-1" />
              <span>{skillNames[ilp.targetSkill]}</span>
            </div>
            
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{format(ilp.timeframeStart, 'dd.MM.yyyy')} - {format(ilp.timeframeEnd, 'dd.MM.yyyy')}</span>
            </div>
            
            <div className="col-span-2 mt-1">
              <span className={`text-xs font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 ${statusConfig[ilp.status].color}`}>
                {statusConfig[ilp.status].name}
              </span>
            </div>
          </div>
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

// Delete Confirmation Component
const DeleteConfirmation: React.FC<{
  ilpDescription: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ ilpDescription, onConfirm, onCancel }) => {
  return (
    <div className="space-y-4">
      <p className="text-center text-gray-700 dark:text-gray-300">
        Er du sikker på at du vil slette ILP med mål: <strong>{ilpDescription}</strong>?
      </p>
      <p className="text-center text-sm text-red-500">
        Dette vil slette all fremgangsdata knyttet til denne ILP og kan ikke angres.
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

// Main ILP Management Component
const ILPManagement: React.FC = () => {
  const { state, addIlp, updateIlp, deleteIlp, selectIlp } = useIlps();
  const { state: kidsState } = useKids();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'list' | 'add' | 'edit' | 'delete'>('list');
  const [selectedEditIlp, setSelectedEditIlp] = useState<ILP | null>(null);
  const [selectedDeleteIlp, setSelectedDeleteIlp] = useState<ILP | null>(null);

  // Redirect if no kid is selected
  useEffect(() => {
    if (!kidsState.selectedKidId) {
      addToast(
        'Du må velge et barn før du kan administrere ILPs.',
        'info'
      );
      navigate('/');
    }
  }, [kidsState.selectedKidId, addToast, navigate]);

  // Filter ILPs for the selected kid
  const filteredIlps = kidsState.selectedKidId 
    ? state.ilps.filter(ilp => ilp.childId === kidsState.selectedKidId)
    : [];

  // Selected kid information
  const selectedKid = kidsState.kids.find(kid => kid.id === kidsState.selectedKidId);

  const handleAddIlp = (formData: ILPFormData) => {
    if (!kidsState.selectedKidId) return;
    
    const ilpData = {
      childId: kidsState.selectedKidId,
      goalDescription: formData.goalDescription,
      targetSkill: formData.targetSkill,
      timeframeStart: new Date(formData.timeframeStart),
      timeframeEnd: new Date(formData.timeframeEnd),
      preferredActivityTypes: formData.preferredActivityTypes,
      accommodationsNotes: formData.accommodationsNotes,
      status: formData.status,
    };
    
    addIlp(ilpData)
      .then(() => {
        addToast(
          `ILP ble opprettet for ${selectedKid?.name}`,
          'success'
        );
        setMode('list');
      })
      .catch(error => {
        addToast(
          `Kunne ikke opprette ILP: ${error.message}`,
          'error'
        );
      });
  };

  const handleUpdateIlp = (formData: ILPFormData) => {
    if (!selectedEditIlp) return;
    
    const ilpData = {
      id: selectedEditIlp.id,
      goalDescription: formData.goalDescription,
      targetSkill: formData.targetSkill,
      timeframeStart: new Date(formData.timeframeStart),
      timeframeEnd: new Date(formData.timeframeEnd),
      preferredActivityTypes: formData.preferredActivityTypes,
      accommodationsNotes: formData.accommodationsNotes,
      status: formData.status,
    };
    
    updateIlp(ilpData)
      .then(() => {
        addToast(
          `ILP ble oppdatert for ${selectedKid?.name}`,
          'success'
        );
        setMode('list');
        setSelectedEditIlp(null);
      })
      .catch(error => {
        addToast(
          `Kunne ikke oppdatere ILP: ${error.message}`,
          'error'
        );
      });
  };

  const handleDeleteIlp = () => {
    if (!selectedDeleteIlp) return;
    
    deleteIlp(selectedDeleteIlp.id)
      .then(() => {
        addToast(
          `ILP ble slettet for ${selectedKid?.name}`,
          'info'
        );
        setMode('list');
        setSelectedDeleteIlp(null);
      })
      .catch(error => {
        addToast(
          `Kunne ikke slette ILP: ${error.message}`,
          'error'
        );
      });
  };

  const startEditIlp = (ilp: ILP) => {
    setSelectedEditIlp(ilp);
    setMode('edit');
  };

  const startDeleteIlp = (ilp: ILP) => {
    setSelectedDeleteIlp(ilp);
    setMode('delete');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">
            ILP Administrasjon {selectedKid && `for ${selectedKid.name}`}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Administrer individuelle læringsplaner (ILPs)
          </p>
        </div>
        
        {mode === 'list' && (
          <Button 
            variant="primary" 
            onClick={() => setMode('add')}
            className="flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Legg til ILP
          </Button>
        )}
      </div>

      {mode === 'list' && (
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold dark:text-white mb-4">Dine ILPs</h2>
            {filteredIlps.length > 0 ? (
              <div className="grid gap-4">
                {filteredIlps.map(ilp => (
                  <ILPCard
                    key={ilp.id}
                    ilp={ilp}
                    isSelected={ilp.id === state.selectedIlpId}
                    onSelect={() => selectIlp(ilp.id)}
                    onEdit={() => startEditIlp(ilp)}
                    onDelete={() => startDeleteIlp(ilp)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Ingen ILPs ennå</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Ingen individuelle læringsplaner er opprettet for {selectedKid?.name}
                </p>
                <Button 
                  variant="primary"
                  onClick={() => setMode('add')}
                  className="inline-flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Legg til første ILP
                </Button>
              </div>
            )}
          </div>

          {/* ILP Dashboard */}
          <div>
            {state.selectedIlpId ? (
              <div>
                <h2 className="text-xl font-bold dark:text-white mb-4">ILP Dashboard</h2>
                <ILPDashboard ilpId={state.selectedIlpId} />
              </div>
            ) : (
              <div className="mt-12 text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Ingen ILP valgt</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Velg en ILP for å se detaljer og fremgang
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {mode === 'add' && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Legg til ny ILP</h2>
          <ILPForm 
            onSubmit={handleAddIlp} 
            onCancel={() => setMode('list')} 
          />
        </Card>
      )}

      {mode === 'edit' && selectedEditIlp && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Rediger ILP</h2>
          <ILPForm 
            initialData={selectedEditIlp} 
            onSubmit={handleUpdateIlp} 
            onCancel={() => {
              setMode('list');
              setSelectedEditIlp(null);
            }} 
          />
        </Card>
      )}

      {mode === 'delete' && selectedDeleteIlp && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-white text-center">Slett ILP</h2>
          <DeleteConfirmation 
            ilpDescription={selectedDeleteIlp.goalDescription} 
            onConfirm={handleDeleteIlp} 
            onCancel={() => {
              setMode('list');
              setSelectedDeleteIlp(null);
            }} 
          />
        </Card>
      )}
    </div>
  );
};

export default ILPManagement; 
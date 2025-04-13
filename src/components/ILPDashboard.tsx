import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Calendar, FileCheck, Activity, CheckCircle2 } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { ILP, ActivitySkillMapping } from '../types/ilp';
import { useIlps } from '../context/ILPContext';
import { 
  calculateILPProgress, 
  getILPProgress, 
  getSuggestedActivities 
} from '../lib/ilpService';

interface ILPDashboardProps {
  ilpId: string;
}

const ILPDashboard: React.FC<ILPDashboardProps> = ({ ilpId }) => {
  const navigate = useNavigate();
  const { state } = useIlps();
  const [ilp, setIlp] = useState<ILP | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [suggestedActivities, setSuggestedActivities] = useState<ActivitySkillMapping[]>([]);

  // Find the ILP and load progress data
  useEffect(() => {
    const foundIlp = state.ilps.find(i => i.id === ilpId);
    if (foundIlp) {
      setIlp(foundIlp);
      // Calculate progress
      const progressPercentage = calculateILPProgress(ilpId);
      setProgress(progressPercentage);
      // Get suggested activities
      const activities = getSuggestedActivities(foundIlp);
      setSuggestedActivities(activities);
    }
  }, [ilpId, state.ilps]);

  if (!ilp) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500 dark:text-gray-400">ILP ikke funnet</p>
      </div>
    );
  }

  // Map skill names for display
  const skillNames: Record<string, string> = {
    'reading': 'Lesing',
    'math': 'Matematikk',
    'social': 'Sosiale ferdigheter',
    'motor': 'Motoriske ferdigheter',
    'language': 'Språk',
    'cognitive': 'Kognitive ferdigheter',
    'emotional': 'Emosjonell utvikling'
  };

  // Map activity types for display
  const activityTypeNames: Record<string, string> = {
    'quiz': 'Quiz',
    'memory': 'Memory',
    'exercise': 'Øvelse',
    'reading': 'Lesing',
    'game': 'Spill'
  };

  // Status color based on progress
  const getStatusColor = () => {
    if (progress >= 75) return 'text-green-500';
    if (progress >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Handle activity click
  const handleActivityClick = (activity: ActivitySkillMapping) => {
    switch (activity.activityType) {
      case 'quiz':
        navigate('/quiz');
        break;
      case 'memory':
        navigate('/memory');
        break;
      default:
        // For other activity types not implemented yet
        alert(`${activityTypeNames[activity.activityType]} aktivitet: ${activity.activitySubtype} - Vil støtte målet: ${ilp.goalDescription}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* ILP Information Card */}
      <Card className="p-4 bg-gray-900/50 backdrop-blur-sm border-purple-500/20">
        <h2 className="text-xl font-semibold text-white mb-3">ILP Oversikt</h2>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="text-gray-400 text-sm">Mål</h3>
            <p className="text-white font-medium">{ilp.goalDescription}</p>
            
            <div className="mt-3 flex items-center">
              <Target className="w-5 h-5 mr-2 text-purple-500" />
              <span className="text-white">{skillNames[ilp.targetSkill]}</span>
            </div>
            
            <div className="mt-2 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-purple-500" />
              <span className="text-white">
                {new Date(ilp.timeframeStart).toLocaleDateString()} - {new Date(ilp.timeframeEnd).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          <div>
            <h3 className="text-gray-400 text-sm mb-2">Fremgang</h3>
            <div className="bg-gray-700 rounded-full h-4 overflow-hidden">
              <div 
                className={`h-full ${progress >= 75 ? 'bg-green-500' : progress >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-sm text-gray-400">0%</span>
              <span className={`text-sm font-medium ${getStatusColor()}`}>{progress}%</span>
              <span className="text-sm text-gray-400">100%</span>
            </div>
            
            <div className="mt-4">
              <Button
                variant="secondary"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => alert('Eksporter rapport - kommer snart')}
              >
                <FileCheck className="w-4 h-4" />
                Eksporter fremgangsrapport
              </Button>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Suggested Activities */}
      <Card className="p-4 bg-gray-900/50 backdrop-blur-sm border-purple-500/20">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold text-white">Anbefalte aktiviteter</h2>
          <Activity className="w-5 h-5 text-purple-500" />
        </div>
        
        {suggestedActivities.length > 0 ? (
          <div className="grid gap-3">
            {suggestedActivities.map((activity, index) => (
              <div 
                key={`${activity.activityType}-${activity.activitySubtype}-${index}`}
                className="bg-gray-800 rounded-lg p-3 hover:bg-gray-700 cursor-pointer transition-colors"
                onClick={() => handleActivityClick(activity)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-medium">
                      {activityTypeNames[activity.activityType]}: {activity.activitySubtype}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Støtter: {activity.associatedSkills.map(skill => skillNames[skill]).join(', ')}
                    </p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-purple-500 opacity-70" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-4">
            Ingen aktiviteter funnet som passer med dette målet.
          </p>
        )}
      </Card>
    </div>
  );
};

export default ILPDashboard; 
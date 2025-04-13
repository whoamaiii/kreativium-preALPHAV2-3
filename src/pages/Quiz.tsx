import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { categories } from '../data/categories';
import ILPActivityTag from '../components/ILPActivityTag';
import { ILPModeToggle } from '../components/ILP/ILPModeToggle';
import { useIlps } from '../context/ILPContext';
import { v4 as uuidv4 } from 'uuid';

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const { ilpModeActive, getRelevantILPsForActivity } = useIlps();
  const [filteredCategories, setFilteredCategories] = useState(categories);
  
  // Generate a stable activity ID for this page to use with ILP integration
  const [activityId] = useState(() => uuidv4());
  
  useEffect(() => {
    // If ILP mode is active, filter categories based on ILP relevance
    if (ilpModeActive) {
      const relevantILPs = getRelevantILPsForActivity('quiz');
      
      // If there are no relevant ILPs, show all categories
      if (relevantILPs.length === 0) {
        setFilteredCategories(categories);
        return;
      }
      
      // Extract relevant skills from ILPs
      const relevantSkills = relevantILPs.map(ilp => ilp.targetSkill);
      
      // Filter categories that match relevant skills
      // This assumes categories have a 'skill' property - adjust as needed
      const filtered = categories.filter(category => {
        // If category has a skill property that matches a relevant skill
        const categorySkill = (category as any).skill || (category as any).targetSkill;
        return categorySkill ? relevantSkills.includes(categorySkill) : true;
      });
      
      setFilteredCategories(filtered.length > 0 ? filtered : categories);
    } else {
      // If ILP mode is not active, show all categories
      setFilteredCategories(categories);
    }
  }, [ilpModeActive, getRelevantILPsForActivity]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Quiz Categories</h1>
        
        {/* ILP Mode Toggle */}
        <ILPModeToggle className="mt-2 md:mt-0" />
      </div>
      
      {/* ILP Activity Tag */}
      <div className="mb-6">
        <ILPActivityTag 
          activityType="quiz" 
          activityId={activityId} 
        />
      </div>
      
      {ilpModeActive && filteredCategories.length === categories.length && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded">
          <p className="text-sm">
            <span className="font-bold">ILP Mode is active</span> but no categories are specifically 
            matched to your active learning plans. Showing all categories.
          </p>
        </div>
      )}
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCategories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              onClick={() => navigate(`/quiz/${category.id}`)}
              className="p-6 cursor-pointer hover:scale-105 transform transition-all bg-gray-900/50 backdrop-blur-sm"
            >
              <h2 className="text-xl font-bold text-white mb-2">{category.name}</h2>
              <p className="text-gray-400 mb-4">{category.description}</p>
              <div className="flex justify-between items-center">
                <div className="text-sm text-purple-400">
                  {(category as any).questionCount ? `${(category as any).questionCount} questions` : ''}
                </div>
                
                {/* Show an indicator if this category matches an ILP skill */}
                {ilpModeActive && (
                  (category as any).skill || (category as any).targetSkill
                ) && (
                  <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Matches ILP
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Quiz;
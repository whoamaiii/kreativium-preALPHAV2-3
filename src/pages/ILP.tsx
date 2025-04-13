import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const ILP: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">ILP - Individualized Learning Plan</h1>
      
      <Card className="p-6 mb-6 bg-gray-800">
        <h2 className="text-xl font-semibold text-white mb-4">What is an ILP?</h2>
        <p className="text-gray-300 mb-4">
          An Individualized Learning Plan (ILP) is a customized educational plan designed 
          to help students reach specific learning goals. It defines target skills, 
          preferred learning activities, and tracks progress towards goals.
        </p>
        <div className="flex justify-end">
          <Button 
            variant="primary" 
            onClick={() => navigate('/ilp/management')}
            className="mt-4"
          >
            Go to ILP Management
          </Button>
        </div>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 bg-gray-800">
          <h2 className="text-xl font-semibold text-white mb-4">Features</h2>
          <ul className="list-disc pl-5 text-gray-300 space-y-2">
            <li>Create personalized learning goals</li>
            <li>Track progress with visual indicators</li>
            <li>Get activity recommendations based on goals</li>
            <li>Generate progress reports</li>
            <li>Set timeframes for goal achievement</li>
          </ul>
        </Card>
        
        <Card className="p-6 bg-gray-800">
          <h2 className="text-xl font-semibold text-white mb-4">Getting Started</h2>
          <ol className="list-decimal pl-5 text-gray-300 space-y-2">
            <li>Select a child from the kid selector</li>
            <li>Go to ILP Management</li>
            <li>Create your first learning plan</li>
            <li>Start recommended activities</li>
            <li>Monitor progress on the dashboard</li>
          </ol>
        </Card>
      </div>
    </div>
  );
};

export default ILP; 
import React from 'react';
import { WorkflowBoard } from '../../components/admin/WorkflowBoard';

export const Workflow: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Content Workflow</h1>
        <p className="text-gray-400">
          Manage and track content through different stages
        </p>
      </div>

      <WorkflowBoard />
    </div>
  );
};
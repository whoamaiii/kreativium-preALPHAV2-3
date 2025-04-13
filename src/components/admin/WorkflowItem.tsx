import React from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { MessageSquare, Clock, User } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { WorkflowItem as WorkflowItemType } from '../../types/workflow';
import { useWorkflow } from '../../hooks/useWorkflow';

interface WorkflowItemProps {
  workflow: WorkflowItemType;
}

export const WorkflowItem: React.FC<WorkflowItemProps> = ({ workflow }) => {
  const { approve, reject, publish, addComment } = useWorkflow();

  const handleApprove = () => {
    approve({ workflowId: workflow.id });
  };

  const handleReject = () => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      reject({ workflowId: workflow.id, reason });
    }
  };

  const handlePublish = () => {
    publish(workflow.id);
  };

  const handleAddComment = () => {
    const comment = prompt('Add a comment:');
    if (comment) {
      addComment({ workflowId: workflow.id, comment });
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-purple-400">
            {workflow.type}
          </span>
          <span className="text-xs text-gray-400">
            {format(new Date(workflow.updatedAt), 'MMM d, HH:mm')}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <User className="w-4 h-4" />
          <span>{workflow.createdBy}</span>
        </div>

        {workflow.assignedTo && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Assigned to: {workflow.assignedTo}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400">
            {workflow.comments.length} comments
          </span>
        </div>

        <div className="flex gap-2">
          {workflow.status === 'in_review' && (
            <>
              <Button size="sm" onClick={handleApprove}>
                Approve
              </Button>
              <Button size="sm" variant="secondary" onClick={handleReject}>
                Reject
              </Button>
            </>
          )}

          {workflow.status === 'approved' && (
            <Button size="sm" onClick={handlePublish}>
              Publish
            </Button>
          )}

          <Button size="sm" variant="secondary" onClick={handleAddComment}>
            Comment
          </Button>
        </div>
      </div>
    </Card>
  );
};
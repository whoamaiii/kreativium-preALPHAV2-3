import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { WorkflowItem } from './WorkflowItem';
import { useWorkflow } from '../../hooks/useWorkflow';
import { WorkflowStatus } from '../../types/workflow';

const columns = [
  { id: WorkflowStatus.DRAFT, title: 'Draft' },
  { id: WorkflowStatus.IN_REVIEW, title: 'In Review' },
  { id: WorkflowStatus.APPROVED, title: 'Approved' },
  { id: WorkflowStatus.PUBLISHED, title: 'Published' },
];

export const WorkflowBoard: React.FC = () => {
  const { workflows, getWorkflowsByStatus } = useWorkflow();

  const onDragEnd = (result: any) => {
    // Handle drag and drop logic here
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-4 gap-6">
        {columns.map((column) => (
          <div key={column.id} className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              {column.title}
              <span className="ml-2 text-sm text-gray-400">
                ({getWorkflowsByStatus(column.id as WorkflowStatus).length})
              </span>
            </h3>

            <Droppable droppableId={column.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-4"
                >
                  {getWorkflowsByStatus(column.id as WorkflowStatus).map(
                    (workflow, index) => (
                      <Draggable
                        key={workflow.id}
                        draggableId={workflow.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <WorkflowItem workflow={workflow} />
                            </motion.div>
                          </div>
                        )}
                      </Draggable>
                    )
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};
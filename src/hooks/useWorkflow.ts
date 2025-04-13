import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { workflowManager } from '../lib/workflow';
import { WorkflowItem, WorkflowStatus } from '../types/workflow';
import { useAuth } from './useAuth';
import { useToast } from './useToast';

export function useWorkflow() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { addToast } = useToast();

  const {
    data: workflows,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      const q = query(
        collection(db, 'workflows'),
        orderBy('updatedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as WorkflowItem[];
    },
  });

  const submitForReviewMutation = useMutation({
    mutationFn: async ({ workflowId, assignTo }: { workflowId: string; assignTo?: string }) => {
      await workflowManager.submitForReview(workflowId, user!, assignTo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      addToast('Item submitted for review', 'success');
    },
    onError: () => {
      addToast('Failed to submit for review', 'error');
    },
  });

  const approveMutation = useMutation({
    mutationFn: async ({ workflowId, comment }: { workflowId: string; comment?: string }) => {
      await workflowManager.approve(workflowId, user!, comment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      addToast('Item approved', 'success');
    },
    onError: () => {
      addToast('Failed to approve item', 'error');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ workflowId, reason }: { workflowId: string; reason: string }) => {
      await workflowManager.reject(workflowId, user!, reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      addToast('Item rejected', 'success');
    },
    onError: () => {
      addToast('Failed to reject item', 'error');
    },
  });

  const publishMutation = useMutation({
    mutationFn: async (workflowId: string) => {
      await workflowManager.publish(workflowId, user!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      addToast('Item published successfully', 'success');
    },
    onError: () => {
      addToast('Failed to publish item', 'error');
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async ({ workflowId, comment }: { workflowId: string; comment: string }) => {
      await workflowManager.addComment(workflowId, user!, comment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      addToast('Comment added', 'success');
    },
    onError: () => {
      addToast('Failed to add comment', 'error');
    },
  });

  const getWorkflowsByStatus = (status: WorkflowStatus) => {
    return workflows?.filter(w => w.status === status) || [];
  };

  const getAssignedWorkflows = () => {
    return workflows?.filter(w => w.assignedTo === user?.id) || [];
  };

  return {
    workflows,
    isLoading,
    error,
    submitForReview: submitForReviewMutation.mutate,
    approve: approveMutation.mutate,
    reject: rejectMutation.mutate,
    publish: publishMutation.mutate,
    addComment: addCommentMutation.mutate,
    getWorkflowsByStatus,
    getAssignedWorkflows,
  };
}
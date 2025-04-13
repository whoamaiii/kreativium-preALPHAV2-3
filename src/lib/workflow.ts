import { collection, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { WorkflowStatus, WorkflowItem } from '../types/workflow';
import { auditLogger } from './auditLogger';
import { AdminUser } from '../types/admin';

class WorkflowManager {
  private async createWorkflowItem(
    type: WorkflowItem['type'],
    contentId: string,
    user: AdminUser
  ): Promise<string> {
    const workflowItem: Omit<WorkflowItem, 'id'> = {
      type,
      contentId,
      status: WorkflowStatus.DRAFT,
      createdBy: user.id,
      assignedTo: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: null,
      reviewedAt: null,
      reviewedBy: null,
      comments: [],
      version: 1,
    };

    const docRef = await addDoc(collection(db, 'workflows'), workflowItem);
    await auditLogger.log('workflow.create', user, {
      workflowId: docRef.id,
      contentId,
      type,
    });

    return docRef.id;
  }

  async submitForReview(
    workflowId: string,
    user: AdminUser,
    assignTo?: string
  ): Promise<void> {
    const workflowRef = doc(db, 'workflows', workflowId);
    const workflowDoc = await getDoc(workflowRef);

    if (!workflowDoc.exists()) {
      throw new Error('Workflow not found');
    }

    const workflow = workflowDoc.data() as WorkflowItem;
    if (workflow.status !== WorkflowStatus.DRAFT) {
      throw new Error('Only draft items can be submitted for review');
    }

    await updateDoc(workflowRef, {
      status: WorkflowStatus.IN_REVIEW,
      assignedTo: assignTo || null,
      updatedAt: new Date().toISOString(),
    });

    await auditLogger.log('workflow.submit_review', user, {
      workflowId,
      assignedTo: assignTo,
    });
  }

  async approve(
    workflowId: string,
    user: AdminUser,
    comment?: string
  ): Promise<void> {
    const workflowRef = doc(db, 'workflows', workflowId);
    const workflowDoc = await getDoc(workflowRef);

    if (!workflowDoc.exists()) {
      throw new Error('Workflow not found');
    }

    const workflow = workflowDoc.data() as WorkflowItem;
    if (workflow.status !== WorkflowStatus.IN_REVIEW) {
      throw new Error('Only items in review can be approved');
    }

    const updates: Partial<WorkflowItem> = {
      status: WorkflowStatus.APPROVED,
      reviewedAt: new Date().toISOString(),
      reviewedBy: user.id,
      updatedAt: new Date().toISOString(),
    };

    if (comment) {
      updates.comments = [
        ...workflow.comments,
        {
          id: Date.now().toString(),
          userId: user.id,
          text: comment,
          createdAt: new Date().toISOString(),
        },
      ];
    }

    await updateDoc(workflowRef, updates);

    await auditLogger.log('workflow.approve', user, {
      workflowId,
      comment,
    });
  }

  async reject(
    workflowId: string,
    user: AdminUser,
    reason: string
  ): Promise<void> {
    const workflowRef = doc(db, 'workflows', workflowId);
    const workflowDoc = await getDoc(workflowRef);

    if (!workflowDoc.exists()) {
      throw new Error('Workflow not found');
    }

    const workflow = workflowDoc.data() as WorkflowItem;
    if (workflow.status !== WorkflowStatus.IN_REVIEW) {
      throw new Error('Only items in review can be rejected');
    }

    await updateDoc(workflowRef, {
      status: WorkflowStatus.REJECTED,
      reviewedAt: new Date().toISOString(),
      reviewedBy: user.id,
      updatedAt: new Date().toISOString(),
      comments: [
        ...workflow.comments,
        {
          id: Date.now().toString(),
          userId: user.id,
          text: reason,
          createdAt: new Date().toISOString(),
        },
      ],
    });

    await auditLogger.log('workflow.reject', user, {
      workflowId,
      reason,
    });
  }

  async publish(workflowId: string, user: AdminUser): Promise<void> {
    const workflowRef = doc(db, 'workflows', workflowId);
    const workflowDoc = await getDoc(workflowRef);

    if (!workflowDoc.exists()) {
      throw new Error('Workflow not found');
    }

    const workflow = workflowDoc.data() as WorkflowItem;
    if (workflow.status !== WorkflowStatus.APPROVED) {
      throw new Error('Only approved items can be published');
    }

    await updateDoc(workflowRef, {
      status: WorkflowStatus.PUBLISHED,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await auditLogger.log('workflow.publish', user, {
      workflowId,
    });
  }

  async addComment(
    workflowId: string,
    user: AdminUser,
    comment: string
  ): Promise<void> {
    const workflowRef = doc(db, 'workflows', workflowId);
    const workflowDoc = await getDoc(workflowRef);

    if (!workflowDoc.exists()) {
      throw new Error('Workflow not found');
    }

    const workflow = workflowDoc.data() as WorkflowItem;
    await updateDoc(workflowRef, {
      comments: [
        ...workflow.comments,
        {
          id: Date.now().toString(),
          userId: user.id,
          text: comment,
          createdAt: new Date().toISOString(),
        },
      ],
      updatedAt: new Date().toISOString(),
    });

    await auditLogger.log('workflow.comment', user, {
      workflowId,
      comment,
    });
  }
}

export const workflowManager = new WorkflowManager();
import { DocumentData } from 'firebase/firestore';
import { Question } from '../types/quiz';
import { MediaFile } from '../types/media';
import { ILP } from '../types/ilp';

/**
 * Type-safe converter for Question documents from Firestore
 * Converts string IDs from Firestore to the required type
 * @param id Document ID
 * @param data Document data
 * @returns Properly typed Question object
 */
export function convertToQuestion(id: string, data: DocumentData): Question {
  // Parse the ID to number if Question requires numeric IDs
  const numericId = parseInt(id, 10) || 0;
  
  return {
    id: numericId, // Use numeric ID for Question type
    category: data.category || '',
    text: data.text || '',
    imageUrl: data.imageUrl || '',
    correctAnswer: data.correctAnswer || '',
    options: Array.isArray(data.options) ? data.options : [],
    difficulty: data.difficulty || 'medium',
    hint: data.hint || '',
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || null,
    ...data
  } as unknown as Question; // Use unknown as intermediate for safer casting
}

/**
 * Batch convert multiple Question documents
 * @param docs Array of Firestore documents
 * @returns Array of typed Question objects
 */
export function convertToQuestions(docs: { id: string, data: () => DocumentData }[]): Question[] {
  return docs.map(doc => convertToQuestion(doc.id, doc.data()));
}

/**
 * Type-safe converter for MediaFile documents from Firestore
 * @param id Document ID
 * @param data Document data
 * @returns Properly typed MediaFile object
 */
export function convertToMediaFile(id: string, data: DocumentData): MediaFile {
  return {
    id,
    name: data.name || '',
    url: data.url || '',
    type: data.type || '',
    size: typeof data.size === 'number' ? data.size : 0,
    folderId: data.folderId || null,
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || undefined,
    metadata: data.metadata || undefined,
    ...data
  } as MediaFile;
}

/**
 * Batch convert multiple MediaFile documents
 * @param docs Array of Firestore documents
 * @returns Array of typed MediaFile objects
 */
export function convertToMediaFiles(docs: { id: string, data: () => DocumentData }[]): MediaFile[] {
  return docs.map(doc => convertToMediaFile(doc.id, doc.data()));
}

/**
 * Type-safe converter for ILP documents from Firestore
 * @param id Document ID
 * @param data Document data
 * @returns Properly typed ILP object
 */
export function convertToILP(id: string, data: DocumentData): ILP {
  return {
    id,
    childId: data.childId || '',
    goalDescription: data.goalDescription || '',
    targetSkill: data.targetSkill || 'reading',
    timeframeStart: data.timeframeStart instanceof Date ? 
      data.timeframeStart : 
      new Date(data.timeframeStart || Date.now()),
    timeframeEnd: data.timeframeEnd instanceof Date ? 
      data.timeframeEnd : 
      new Date(data.timeframeEnd || Date.now() + 30 * 24 * 60 * 60 * 1000),
    preferredActivityTypes: Array.isArray(data.preferredActivityTypes) ? 
      data.preferredActivityTypes : 
      ['quiz'],
    status: data.status || 'active',
    createdAt: data.createdAt instanceof Date ? 
      data.createdAt : 
      new Date(data.createdAt || Date.now()),
    updatedAt: data.updatedAt instanceof Date ? 
      data.updatedAt : 
      new Date(data.updatedAt || Date.now()),
    accommodationsNotes: data.accommodationsNotes || undefined,
    statusReason: data.statusReason || undefined,
    objectives: data.objectives || undefined,
    educatorNotes: data.educatorNotes || undefined,
    approvalStatus: data.approvalStatus || undefined,
    ...data
  } as ILP;
}

/**
 * Batch convert multiple ILP documents
 * @param docs Array of Firestore documents
 * @returns Array of typed ILP objects
 */
export function convertToILPs(docs: { id: string, data: () => DocumentData }[]): ILP[] {
  return docs.map(doc => convertToILP(doc.id, doc.data()));
} 
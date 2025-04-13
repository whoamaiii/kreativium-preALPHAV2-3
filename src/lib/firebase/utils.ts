import { collection, getDocs, getDoc, doc, query, QueryConstraint, DocumentData } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Type-safe function to get documents from a collection
 * @param collectionPath The path to the collection
 * @param queryConstraints Optional query constraints like where, orderBy, etc.
 * @returns Typed array of documents
 */
export async function getTypedCollection<T>(
  collectionPath: string,
  queryConstraints: QueryConstraint[] = []
): Promise<T[]> {
  try {
    const collectionRef = collection(db, collectionPath);
    const q = query(collectionRef, ...queryConstraints);
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as T));
  } catch (error) {
    console.error(`Error fetching collection ${collectionPath}:`, error);
    throw error;
  }
}

/**
 * Type-safe function to get a document by ID
 * @param collectionPath The path to the collection
 * @param docId The document ID
 * @returns Typed document or null if not found
 */
export async function getTypedDoc<T>(
  collectionPath: string,
  docId: string
): Promise<T | null> {
  try {
    const docRef = doc(db, collectionPath, docId);
    const snapshot = await getDoc(docRef);
    
    if (!snapshot.exists()) {
      return null;
    }
    
    return {
      id: snapshot.id,
      ...snapshot.data()
    } as T;
  } catch (error) {
    console.error(`Error fetching document ${collectionPath}/${docId}:`, error);
    throw error;
  }
}

/**
 * Type-safe data converter for Firestore data
 * Adds proper typing to document data without runtime validation
 * @param id Document ID
 * @param data Document data
 * @returns Typed document data
 */
export function convertToTypedDoc<T>(id: string, data: DocumentData): T {
  return {
    id,
    ...data
  } as T;
} 
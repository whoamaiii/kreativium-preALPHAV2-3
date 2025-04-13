import CryptoJS from 'crypto-js';

/**
 * Secret key for encryption/decryption
 * In a real application, this should come from an environment variable
 */
const SECRET_KEY = import.meta.env.VITE_STORAGE_SECRET || 'app-secure-storage-key';

/**
 * Encrypts data before storing it
 * @param data Any data that can be JSON stringified
 * @returns Encrypted string
 */
export function encryptData(data: any): string {
  try {
    const jsonString = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypts data that was encrypted with encryptData
 * @param encryptedData The encrypted string
 * @returns The original data object
 */
export function decryptData<T = any>(encryptedData: string): T | null {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString) as T;
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
}

/**
 * Securely stores data in localStorage with encryption
 */
export const secureLocalStorage = {
  /**
   * Store a value securely in localStorage
   */
  setItem(key: string, value: any): void {
    try {
      const encryptedValue = encryptData(value);
      localStorage.setItem(key, encryptedValue);
    } catch (error) {
      console.error(`Error storing ${key} in localStorage:`, error);
    }
  },

  /**
   * Retrieve and decrypt a value from localStorage
   */
  getItem<T = any>(key: string): T | null {
    try {
      const encryptedValue = localStorage.getItem(key);
      if (!encryptedValue) return null;
      return decryptData<T>(encryptedValue);
    } catch (error) {
      console.error(`Error retrieving ${key} from localStorage:`, error);
      return null;
    }
  },

  /**
   * Remove an item from localStorage
   */
  removeItem(key: string): void {
    localStorage.removeItem(key);
  },

  /**
   * Clear all items from localStorage
   */
  clear(): void {
    localStorage.clear();
  }
}; 
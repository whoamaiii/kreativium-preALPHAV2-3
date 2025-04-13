import { z } from 'zod';
import { errorTracker } from './errorTracking';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE, MAX_FILES } from './constants/media';

export class FileValidator {
  private static readonly MAGIC_NUMBERS = {
    'image/jpeg': ['ffd8ffe0', 'ffd8ffe1', 'ffd8ffe2'],
    'image/png': ['89504e47'],
    'image/gif': ['47494638'],
    'image/webp': ['52494646'],
  };

  static validateFile(file: File): { isValid: boolean; error?: string } {
    try {
      // Validate file type
      if (!Object.keys(ALLOWED_FILE_TYPES).includes(file.type)) {
        return {
          isValid: false,
          error: 'Invalid file type. Only JPG, PNG, WebP, and GIF files are allowed.',
        };
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return {
          isValid: false,
          error: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        };
      }

      // Validate file name length and characters
      if (file.name.length > 255 || !/^[a-zA-Z0-9-_. ]+$/.test(file.name)) {
        return {
          isValid: false,
          error: 'Invalid file name. Use only letters, numbers, hyphens, and underscores.',
        };
      }

      // Check for malicious file extensions
      const extension = file.name.toLowerCase().split('.').pop();
      if (!extension || !Object.values(ALLOWED_FILE_TYPES).flat().includes(`.${extension}`)) {
        return {
          isValid: false,
          error: 'Invalid file extension',
        };
      }

      // Validate file content type matches extension
      const expectedExtensions = ALLOWED_FILE_TYPES[file.type as keyof typeof ALLOWED_FILE_TYPES];
      if (!expectedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))) {
        return {
          isValid: false,
          error: 'File extension does not match content type',
        };
      }

      return { isValid: true };
    } catch (error) {
      errorTracker.captureException(error, {
        action: 'validate_file',
        metadata: { fileName: file.name, fileType: file.type },
      });
      return {
        isValid: false,
        error: 'File validation failed',
      };
    }
  }

  static async validateFileContent(file: File): Promise<{ isValid: boolean; error?: string }> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onloadend = () => {
        try {
          const arr = new Uint8Array(reader.result as ArrayBuffer).subarray(0, 4);
          let header = '';
          for (let i = 0; i < arr.length; i++) {
            header += arr[i].toString(16);
          }

          const validSignatures = this.MAGIC_NUMBERS[file.type as keyof typeof this.MAGIC_NUMBERS];
          if (!validSignatures?.includes(header)) {
            resolve({
              isValid: false,
              error: 'File content does not match declared type',
            });
            return;
          }

          resolve({ isValid: true });
        } catch (error) {
          errorTracker.captureException(error, {
            action: 'validate_file_content',
            metadata: { fileName: file.name },
          });
          resolve({
            isValid: false,
            error: 'File content validation failed',
          });
        }
      };

      reader.onerror = () => {
        resolve({
          isValid: false,
          error: 'Failed to read file',
        });
      };

      reader.readAsArrayBuffer(file);
    });
  }

  static async scanFile(file: File): Promise<{ isClean: boolean; error?: string }> {
    try {
      // Implement client-side security checks
      const validationResult = await this.validateFileContent(file);
      if (!validationResult.isValid) {
        return {
          isClean: false,
          error: validationResult.error,
        };
      }

      // Additional security checks could be implemented here
      // For example, checking for malicious content patterns

      return { isClean: true };
    } catch (error) {
      errorTracker.captureException(error, {
        action: 'scan_file',
        metadata: { fileName: file.name },
      });
      return {
        isClean: false,
        error: 'Security scan failed',
      };
    }
  }

  static async validateAndScanFile(file: File): Promise<{ isValid: boolean; error?: string }> {
    // Step 1: Basic validation
    const validationResult = this.validateFile(file);
    if (!validationResult.isValid) {
      return validationResult;
    }

    // Step 2: Content validation
    const contentValidation = await this.validateFileContent(file);
    if (!contentValidation.isValid) {
      return contentValidation;
    }

    // Step 3: Security scan
    const scanResult = await this.scanFile(file);
    if (!scanResult.isClean) {
      return {
        isValid: false,
        error: scanResult.error || 'File failed security scan',
      };
    }

    return { isValid: true };
  }

  static validateMultipleFiles(files: File[]): { isValid: boolean; error?: string } {
    // Validate total number of files
    if (files.length > MAX_FILES) {
      return {
        isValid: false,
        error: `Maximum ${MAX_FILES} files allowed`,
      };
    }

    // Validate total size
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > MAX_FILES * MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: 'Total file size exceeds limit',
      };
    }

    return { isValid: true };
  }
}

// Re-export constants for convenience
export { ALLOWED_FILE_TYPES, MAX_FILE_SIZE, MAX_FILES };
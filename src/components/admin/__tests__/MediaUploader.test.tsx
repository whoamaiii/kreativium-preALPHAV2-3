import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SecureMediaUploader } from '../SecureMediaUploader';
import { FileValidator } from '../../../lib/fileValidation';

// Mock FileValidator
vi.mock('../../../lib/fileValidation', () => ({
  FileValidator: {
    validateAndScanFile: vi.fn(),
    ALLOWED_FILE_TYPES: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/gif': ['.gif'],
    },
    MAX_FILE_SIZE: 5 * 1024 * 1024,
    MAX_FILES: 10,
  }
}));

describe('SecureMediaUploader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders upload area correctly', () => {
    render(<SecureMediaUploader onUploadComplete={() => {}} />);
    
    expect(screen.getByText(/drag & drop/i)).toBeInTheDocument();
    expect(screen.getByText(/maximum file size/i)).toBeInTheDocument();
  });

  it('handles file drop correctly', async () => {
    const onUploadComplete = vi.fn();
    render(<SecureMediaUploader onUploadComplete={onUploadComplete} />);

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    (FileValidator.validateAndScanFile as any).mockResolvedValue({ isValid: true });

    const dropzone = screen.getByText(/drag & drop/i).parentElement!;
    
    Object.defineProperty(dropzone, 'getBoundingClientRect', {
      value: () => ({
        bottom: 500,
        height: 100,
        left: 0,
        right: 500,
        top: 0,
        width: 500,
        x: 0,
        y: 0,
      }),
    });

    await userEvent.upload(dropzone, file);

    expect(FileValidator.validateAndScanFile).toHaveBeenCalledWith(file);
    await waitFor(() => {
      expect(screen.getByText(/uploading/i)).toBeInTheDocument();
    });
  });

  it('shows error for invalid file type', async () => {
    const onUploadComplete = vi.fn();
    render(<SecureMediaUploader onUploadComplete={onUploadComplete} />);

    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const dropzone = screen.getByText(/drag & drop/i).parentElement!;

    await userEvent.upload(dropzone, file);

    expect(screen.getByText(/invalid file type/i)).toBeInTheDocument();
    expect(onUploadComplete).not.toHaveBeenCalled();
  });

  it('shows error for file size exceeding limit', async () => {
    const onUploadComplete = vi.fn();
    render(<SecureMediaUploader onUploadComplete={onUploadComplete} />);

    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
    const dropzone = screen.getByText(/drag & drop/i).parentElement!;

    await userEvent.upload(dropzone, largeFile);

    expect(screen.getByText(/file size must be less than 5MB/i)).toBeInTheDocument();
    expect(onUploadComplete).not.toHaveBeenCalled();
  });

  it('handles virus scan failure', async () => {
    const onUploadComplete = vi.fn();
    render(<SecureMediaUploader onUploadComplete={onUploadComplete} />);

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    (FileValidator.validateAndScanFile as any).mockResolvedValue({
      isValid: false,
      error: 'File failed security scan',
    });

    const dropzone = screen.getByText(/drag & drop/i).parentElement!;
    await userEvent.upload(dropzone, file);

    expect(screen.getByText(/file failed security scan/i)).toBeInTheDocument();
    expect(onUploadComplete).not.toHaveBeenCalled();
  });

  it('shows upload progress', async () => {
    const onUploadComplete = vi.fn();
    render(<SecureMediaUploader onUploadComplete={onUploadComplete} />);

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    (FileValidator.validateAndScanFile as any).mockResolvedValue({ isValid: true });

    const dropzone = screen.getByText(/drag & drop/i).parentElement!;
    await userEvent.upload(dropzone, file);

    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  it('allows multiple file upload within limits', async () => {
    const onUploadComplete = vi.fn();
    render(<SecureMediaUploader onUploadComplete={onUploadComplete} />);

    const files = Array.from({ length: 3 }, (_, i) => 
      new File(['test'], `test${i}.jpg`, { type: 'image/jpeg' })
    );

    (FileValidator.validateAndScanFile as any).mockResolvedValue({ isValid: true });

    const dropzone = screen.getByText(/drag & drop/i).parentElement!;
    await userEvent.upload(dropzone, files);

    expect(FileValidator.validateAndScanFile).toHaveBeenCalledTimes(3);
  });

  it('prevents upload when max files limit is reached', async () => {
    const onUploadComplete = vi.fn();
    render(<SecureMediaUploader onUploadComplete={onUploadComplete} maxFiles={2} />);

    const files = Array.from({ length: 3 }, (_, i) => 
      new File(['test'], `test${i}.jpg`, { type: 'image/jpeg' })
    );

    const dropzone = screen.getByText(/drag & drop/i).parentElement!;
    await userEvent.upload(dropzone, files);

    expect(screen.getByText(/maximum 2 files allowed/i)).toBeInTheDocument();
  });
});
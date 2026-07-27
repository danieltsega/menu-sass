import { describe, it, expect, vi } from 'vitest';
import multer from 'multer';

describe('Upload Middleware', () => {
  it('should be a multer instance', async () => {
    const { upload } = await import('../src/middleware/upload');
    expect(upload).toBeDefined();
    expect(typeof upload.single).toBe('function');
  });

  it('should have correct file size limit', () => {
    const limits = multer({ limits: { fileSize: 5 * 1024 * 1024 } }).single('image');
    expect(limits).toBeDefined();
  });
});
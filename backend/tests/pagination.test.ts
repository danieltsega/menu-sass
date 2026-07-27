import { describe, it, expect } from 'vitest';
import { getPaginationParams, getPaginationMeta } from '../src/utils/pagination';

describe('Pagination Utils', () => {
  describe('getPaginationParams', () => {
    it('should return defaults when no args', () => {
      const result = getPaginationParams();
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
      expect(result.skip).toBe(0);
    });

    it('should cap limit at 100', () => {
      const result = getPaginationParams(1, 200);
      expect(result.limit).toBe(100);
    });

    it('should enforce minimum page of 1', () => {
      const result = getPaginationParams(0, 10);
      expect(result.page).toBe(1);
    });

    it('should calculate skip correctly', () => {
      const result = getPaginationParams(3, 10);
      expect(result.page).toBe(3);
      expect(result.limit).toBe(10);
      expect(result.skip).toBe(20);
    });
  });

  describe('getPaginationMeta', () => {
    it('should calculate totalPages', () => {
      const params = getPaginationParams(1, 10);
      const meta = getPaginationMeta(25, params);
      expect(meta.total).toBe(25);
      expect(meta.totalPages).toBe(3);
    });

    it('should return at least 1 totalPage', () => {
      const params = getPaginationParams(1, 10);
      const meta = getPaginationMeta(0, params);
      expect(meta.totalPages).toBe(1);
    });
  });
});
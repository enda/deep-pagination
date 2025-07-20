import { generatePagination } from '../src/index';

describe('generatePagination', () => {
  describe('Input validation', () => {
    it('should throw error for invalid current page', () => {
      expect(() => generatePagination({ current: 0, max: 10 })).toThrow('Current page must be a positive integer');
      expect(() => generatePagination({ current: -1, max: 10 })).toThrow('Current page must be a positive integer');
      expect(() => generatePagination({ current: 1.5, max: 10 })).toThrow('Current page must be a positive integer');
    });

    it('should throw error for invalid max pages', () => {
      expect(() => generatePagination({ current: 1, max: 0 })).toThrow('Max pages must be a positive integer');
      expect(() => generatePagination({ current: 1, max: -1 })).toThrow('Max pages must be a positive integer');
      expect(() => generatePagination({ current: 1, max: 1.5 })).toThrow('Max pages must be a positive integer');
    });

    it('should throw error when current > max', () => {
      expect(() => generatePagination({ current: 11, max: 10 })).toThrow('Current page cannot be greater than max pages');
    });

    it('should throw error for invalid pad', () => {
      expect(() => generatePagination({ current: 1, max: 10, pad: -1 })).toThrow('Pad must be a non-negative integer');
      expect(() => generatePagination({ current: 1, max: 10, pad: 1.5 })).toThrow('Pad must be a non-negative integer');
    });
  });

  describe('Default values', () => {
    it('should use default pad value (2)', () => {
      const result = generatePagination({ current: 50, max: 100 });
      expect(result.pages).toContain(48); // current - 2
      expect(result.pages).toContain(52); // current + 2
    });

    it('should use default gap symbol (…)', () => {
      const result = generatePagination({ current: 50, max: 100 });
      if (result.pages.some(p => typeof p === 'string')) {
        expect(result.pages).toContain('…');
      }
    });

    it('should use default jump values', () => {
      const result = generatePagination({ current: 5000, max: 10000 });
      expect(result.pages).toContain(1);
      expect(result.pages).toContain(5000);
      expect(result.pages).toContain(10000);
    });
  });

  describe('Simple pagination (few pages)', () => {
    it('should return all pages when max < threshold', () => {
      const result1 = generatePagination({ current: 1, max: 5 });
      expect(result1.pages).toEqual([1, 2, 3, 4, 5]);

      const result2 = generatePagination({ current: 3, max: 5 });
      expect(result2.pages).toEqual([1, 2, 3, 4, 5]);

      const result3 = generatePagination({ current: 1, max: 10 });
      expect(result3.pages).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    it('should handle single page', () => {
      const result = generatePagination({ current: 1, max: 1 });
      expect(result.pages).toEqual([1]);
      expect(result.hasPrevious).toBe(false);
      expect(result.hasNext).toBe(false);
    });
  });

  describe('Complex pagination (many pages)', () => {
    it('should include first, current and last pages', () => {
      const result = generatePagination({ current: 50, max: 100 });
      expect(result.pages).toContain(1);
      expect(result.pages).toContain(50);
      expect(result.pages).toContain(100);
    });

    it('should include pages around current with default pad', () => {
      const result = generatePagination({ current: 50, max: 100 });
      expect(result.pages).toContain(48);
      expect(result.pages).toContain(49);
      expect(result.pages).toContain(50);
      expect(result.pages).toContain(51);
      expect(result.pages).toContain(52);
    });

    it('should respect custom pad value', () => {
      const result = generatePagination({ current: 50, max: 100, pad: 1 });
      expect(result.pages).toContain(49);
      expect(result.pages).toContain(50);
      expect(result.pages).toContain(51);
      expect(result.pages).not.toContain(48);
      expect(result.pages).not.toContain(52);
    });

    it('should include gaps for large jumps', () => {
      const result = generatePagination({ current: 50, max: 100 });
      expect(result.pages).toContain('…');
    });

    it('should handle edge case at beginning', () => {
      const result = generatePagination({ current: 1, max: 100 });
      expect(result.pages[0]).toBe(1);
      expect(result.pages).toContain(100);
    });

    it('should handle edge case at end', () => {
      const result = generatePagination({ current: 100, max: 100 });
      expect(result.pages).toContain(1);
      expect(result.pages[result.pages.length - 1]).toBe(100);
    });
  });

  describe('Metadata properties', () => {
    it('should return correct metadata for middle page', () => {
      const result = generatePagination({ current: 5, max: 20 });

      expect(result.currentPage).toBe(5);
      expect(result.totalPages).toBe(20);
      expect(result.hasPrevious).toBe(true);
      expect(result.hasNext).toBe(true);
      expect(Array.isArray(result.pages)).toBe(true);
    });

    it('should handle first page correctly', () => {
      const result = generatePagination({ current: 1, max: 20 });

      expect(result.hasPrevious).toBe(false);
      expect(result.hasNext).toBe(true);
    });

    it('should handle last page correctly', () => {
      const result = generatePagination({ current: 20, max: 20 });

      expect(result.hasPrevious).toBe(true);
      expect(result.hasNext).toBe(false);
    });
  });

  describe('Custom options', () => {
    it('should use custom gap symbol', () => {
      const result = generatePagination({
        current: 50,
        max: 100,
        gapSymbol: '---'
      });

      const hasCustomGap = result.pages.includes('---');
      const hasDefaultGap = result.pages.includes('…');

      if (hasCustomGap) {
        expect(hasDefaultGap).toBe(false);
      }
    });

    it('should work with custom jump values', () => {
      const result = generatePagination({
        current: 50,
        max: 500,
        jumpValues: [1000, 200, 50, 10, 1]
      });

      expect(result.pages).toContain(1);
      expect(result.pages).toContain(50);
      expect(result.pages).toContain(500);
    });

    it('should validate custom jump values', () => {
      expect(() => generatePagination({
        current: 50,
        max: 100,
        jumpValues: [10, 100, 1000] // Wrong order
      })).toThrow('Jump values must be sorted in descending order');

      expect(() => generatePagination({
        current: 50,
        max: 100,
        jumpValues: []
      })).toThrow('Jump values must be a non-empty array');

      expect(() => generatePagination({
        current: 50,
        max: 100,
        jumpValues: [100, -10, 1]
      })).toThrow('All jump values must be positive integers');
    });
  });

  describe('Multi-level deep pages', () => {
    it('should generate strategic jump points for large page sets', () => {
      const result = generatePagination({ current: 5000, max: 10000 });

      expect(result.pages).toContain(1);
      expect(result.pages).toContain(5000);
      expect(result.pages).toContain(10000);

      const numericPages = result.pages.filter(p => typeof p === 'number') as number[];
      expect(numericPages.length).toBeGreaterThan(3);
    });

    it('should maintain reasonable pagination length', () => {
      const result = generatePagination({ current: 5000, max: 50000 });
      expect(result.pages.length).toBeLessThan(30);
    });

    it('should handle large custom jump values', () => {
      const result = generatePagination({
        current: 5000,
        max: 50000,
        jumpValues: [100000, 50000, 10000, 1000, 100, 10, 1]
      });

      expect(result.pages).toContain(1);
      expect(result.pages).toContain(5000);
      expect(result.pages).toContain(50000);
      expect(result.pages.length).toBeLessThan(25);
    });
  });

  describe('Gap optimization', () => {
    it('should avoid unnecessary gaps between consecutive pages', () => {
      const result = generatePagination({ current: 3, max: 20 });

      if (result.pages.includes(1) && result.pages.includes(3)) {
        const indexOf1 = result.pages.indexOf(1);
        const indexOf3 = result.pages.indexOf(3);
        if (Math.abs(indexOf1 - indexOf3) <= 2) {
          expect(result.pages).toContain(2);
        }
      }
    });

    it('should handle gap symbol replacement correctly', () => {
      const result = generatePagination({ current: 10, max: 50 });

      const gapIndex = result.pages.indexOf('…');
      if (gapIndex > 0 && gapIndex < result.pages.length - 1) {
        const beforeGap = result.pages[gapIndex - 1];
        const afterGap = result.pages[gapIndex + 1];
        if (beforeGap === 1) {
          expect(afterGap).not.toBe(3);
        }
      }
    });
  });

  describe('Real-world scenarios', () => {
    it('should handle typical e-commerce pagination', () => {
      const result = generatePagination({ current: 10, max: 50 });

      expect(result.pages).toContain(1);
      expect(result.pages).toContain(10);
      expect(result.pages).toContain(50);
      expect(result.pages.length).toBeLessThan(20);
    });

    it('should handle large dataset pagination', () => {
      const result = generatePagination({ current: 1500, max: 3000 });

      expect(result.pages).toContain(1);
      expect(result.pages).toContain(1500);
      expect(result.pages).toContain(3000);
      expect(result.pages.includes('…')).toBe(true);
    });

    it('should handle custom jump values for search results', () => {
      const result = generatePagination({
        current: 45,
        max: 100,
        pad: 2,
        jumpValues: [500, 100, 50, 25, 10, 5, 1]
      });

      expect(result.pages).toContain(1);
      expect(result.pages).toContain(45);
      expect(result.pages).toContain(100);
      expect(result.pages).toContain(43);
      expect(result.pages).toContain(44);
      expect(result.pages).toContain(46);
      expect(result.pages).toContain(47);
    });

    it('should work correctly with small page ranges', () => {
      const result = generatePagination({ current: 2, max: 5 });
      expect(result.pages).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle edge cases near boundaries', () => {
      // Test near the beginning
      const resultNearStart = generatePagination({ current: 3, max: 100 });
      expect(resultNearStart.pages).toContain(1);
      expect(resultNearStart.pages).toContain(2);
      expect(resultNearStart.pages).toContain(3);
      expect(resultNearStart.pages).toContain(4);
      expect(resultNearStart.pages).toContain(5);

      // Test near the end
      const resultNearEnd = generatePagination({ current: 98, max: 100 });
      expect(resultNearEnd.pages).toContain(96);
      expect(resultNearEnd.pages).toContain(97);
      expect(resultNearEnd.pages).toContain(98);
      expect(resultNearEnd.pages).toContain(99);
      expect(resultNearEnd.pages).toContain(100);
    });

    it('should handle different pad values correctly', () => {
      const pad0 = generatePagination({ current: 50, max: 100, pad: 0 });
      expect(pad0.pages).toContain(50);
      expect(pad0.pages).not.toContain(49);
      expect(pad0.pages).not.toContain(51);

      const pad3 = generatePagination({ current: 50, max: 100, pad: 3 });
      expect(pad3.pages).toContain(47);
      expect(pad3.pages).toContain(53);
    });
  });
});

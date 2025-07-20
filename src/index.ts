/**
 * Deep Pagination - Intelligent pagination generator with multi-level deep pages
 * Optimized for SEO-friendly crawling while maintaining usability
 */

export interface PaginationOptions {
  /** Current page number (1-based) */
  current: number;
  /** Maximum number of pages */
  max: number;
  /** Number of additional pages to show around current page (default: 2) */
  pad?: number;
  /** Custom gap symbol (default: '…') */
  gapSymbol?: string;
  /** Custom jump values for multi-level pagination (default: [50000, 25000, 10000, 5000, 1000, 500, 250, 100, 50, 25, 10, 5, 1]) */
  jumpValues?: number[];
}

export interface PaginationResult {
  /** Array of page numbers and gap symbols */
  pages: (number | string)[];
  /** Whether there are more pages before the first shown page */
  hasPrevious: boolean;
  /** Whether there are more pages after the last shown page */
  hasNext: boolean;
  /** Total number of pages */
  totalPages: number;
  /** Current page number */
  currentPage: number;
}

const DEFAULT_GAP = '…';
const DEFAULT_JUMP_VALUES = [50000, 25000, 10000, 5000, 1000, 500, 250, 100, 50, 25, 10, 5, 1] as const;
const DEFAULT_PAD = 2;

/**
 * Validates jump values array
 */
const validateJumpValues = (jumps: number[]): void => {
  if (!Array.isArray(jumps) || jumps.length === 0) {
    throw new Error('Jump values must be a non-empty array');
  }

  if (!jumps.every(jump => Number.isInteger(jump) && jump > 0)) {
    throw new Error('All jump values must be positive integers');
  }

  // Check if array is sorted in descending order
  for (let i = 0; i < jumps.length - 1; i++) {
    if (jumps[i] <= jumps[i + 1]) {
      throw new Error('Jump values must be sorted in descending order');
    }
  }
};

/**
 * Finds appropriate lower value for pagination jumps
 */
const findLowerValuesFor = (
  min: number,
  max: number,
  iteration: number,
  pad: number,
  jumps: number[] = [...DEFAULT_JUMP_VALUES]
): number => {
  let jumpIndex = jumps.findIndex((jump) => jump < max);
  jumpIndex = jumpIndex >= 0 ? jumpIndex : jumps.length - 1;

  let margin = 0;
  for (let i = 0; i < pad - iteration; ++i) {
    if (
      jumpIndex - margin - 1 < jumps.length &&
      max - (max % jumps[jumpIndex]) - jumps[jumpIndex - margin - 1] > min
    ) {
      margin = margin + 1;
    }
  }

  if (iteration <= 0) {
    if (max % jumps[jumpIndex] === 0) {
      return margin ? max - jumps[jumpIndex] - jumps[jumpIndex - margin] : max - jumps[jumpIndex];
    }
    return margin ? max - (max % jumps[jumpIndex]) - jumps[jumpIndex - margin] : max - (max % jumps[jumpIndex]);
  }
  return max - jumps[jumpIndex - margin];
};

/**
 * Finds appropriate larger value for pagination jumps
 */
const findLargerValuesFor = (
  min: number,
  max: number,
  iteration: number,
  jumps: number[] = [...DEFAULT_JUMP_VALUES]
): number => {
  let jumpIndex = jumps.findIndex((jump) => jump < max && min - (min % jump) + jump < max);
  jumpIndex = jumpIndex >= 0 ? jumpIndex : jumps.length - 1;

  for (let i = 0; i < iteration; ++i) {
    if (
      jumpIndex + 1 < jumps.length &&
      min - (min % jumps[jumpIndex + 1]) + jumps[jumpIndex + 1] < max
    ) {
      jumpIndex = jumpIndex + 1;
    }
  }

  if (min % jumps[jumpIndex] === 0) {
    return min + jumps[jumpIndex];
  }
  return min - (min % jumps[jumpIndex]) + jumps[jumpIndex];
};

/**
 * Adds a page to the pagination array with smart gap handling
 */
const addPage = (pagination: (string | number)[], page: number, position: number, gapSymbol: string): void => {
  const lastItem = pagination[pagination.length - 1];
  const secondLastItem = pagination[pagination.length - 2];

  if (lastItem === gapSymbol && secondLastItem === page - 2) {
    // Replace gap if we can connect consecutive pages
    pagination[pagination.length - 1] = page - 1;
    pagination.push(page);

    if (position < 1) {
      // Handle middle left positioning
      let gapAt = -1;
      for (let i = pagination.length - 2; i >= 0; --i) {
        if ((pagination[i] as number) + 1 !== pagination[i + 1]) {
          gapAt = i + 1;
          break;
        }
      }
      if (gapAt >= 0) {
        pagination.push(page);
        for (let i = 0; i < pagination.length - gapAt - 2; ++i) {
          pagination[pagination.length - 2 - i] = pagination[pagination.length - 3 - i];
        }
        pagination[gapAt] = gapSymbol;
      }
    }
  } else if (lastItem !== page) {
    pagination.push(page);
  }

  // Fix small gap between 1 and 3
  if (pagination[1] === gapSymbol && pagination[2] === 3) {
    pagination[1] = 2;
  }
};

/**
 * Validates input parameters
 */
const validateInput = (current: number, max: number, pad?: number): void => {
  if (!Number.isInteger(current) || current < 1) {
    throw new Error('Current page must be a positive integer');
  }
  if (!Number.isInteger(max) || max < 1) {
    throw new Error('Max pages must be a positive integer');
  }
  if (current > max) {
    throw new Error('Current page cannot be greater than max pages');
  }
  if (pad !== undefined && (!Number.isInteger(pad) || pad < 0)) {
    throw new Error('Pad must be a non-negative integer');
  }
};

/**
 * Generates pagination array with smart gap handling
 */
const generatePaginationArray = (
  current: number,
  max: number,
  pad: number,
  gapSymbol: string,
  jumpValues: number[]
): (string | number)[] => {
  const minPagesForComplex = 7 + pad * 4;

  // Simple pagination for small page counts
  if (max < minPagesForComplex) {
    return Array.from({ length: max }, (_, i) => i + 1);
  }

  const pagination: (string | number)[] = [];

  // Build pagination by iterating through all possible pages
  for (let page = 1; page <= max; page++) {
    // Always include first, current, and last pages
    if (page === 1 || page === max || page === current) {
      addPage(pagination, page, 0, gapSymbol);
      continue;
    }

    // Handle left side (before current)
    if (page < current && pagination.indexOf(gapSymbol) < 0) {
      if (pagination.length < pad + 2 && pad > 0) {
        let value = current - pad - 1;
        const tempPages: number[] = [];

        for (let i = 0; i < pad + 1; ++i) {
          value = findLowerValuesFor(1, value, i, pad, jumpValues);
          if (value > 1 && pagination.indexOf(value) < 0) {
            tempPages.push(value);
          }
        }

        tempPages.reverse();
        for (const p of tempPages) {
          addPage(pagination, p, -1, gapSymbol);
        }

        pagination.push(gapSymbol);
        continue;
      }
    }

    // Handle middle range (around current page)
    if (page >= current - pad && page <= current + pad) {
      addPage(pagination, page, 0, gapSymbol);
      continue;
    }

    // Handle right side (after current)
    if (page > current) {
      // Add gap if there's a jump
      if (current + pad + 1 === page && page !== max - 1) {
        pagination.push(gapSymbol);
        continue;
      }

      // Calculate appropriate page for right side
      if (pagination.length < minPagesForComplex - 1) {
        const lastPage = pagination[pagination.length - 1];
        const baseValue = lastPage === gapSymbol ? page : (lastPage as number);
        const value = findLargerValuesFor(baseValue, max, minPagesForComplex - pagination.length - 2, jumpValues);

        if (value < max) {
          addPage(pagination, value, 1, gapSymbol);
        } else {
          addPage(pagination, page, 1, gapSymbol);
        }
        continue;
      }
    }
  }

  return pagination;
};

/**
 * Generates smart pagination with multi-level deep pages
 * Optimized for SEO crawlers while maintaining user experience
 */
export const generatePagination = (options: PaginationOptions): PaginationResult => {
  const {
    current,
    max,
    pad = DEFAULT_PAD,
    gapSymbol = DEFAULT_GAP,
    jumpValues
  } = options;

  validateInput(current, max, pad);

  const jumps = jumpValues ? [...jumpValues] : [...DEFAULT_JUMP_VALUES];
  if (jumpValues) {
    validateJumpValues(jumps);
  }

  const pages = generatePaginationArray(current, max, pad, gapSymbol, jumps);

  return {
    pages,
    hasPrevious: current > 1,
    hasNext: current < max,
    totalPages: max,
    currentPage: current,
  };
};

export default generatePagination;

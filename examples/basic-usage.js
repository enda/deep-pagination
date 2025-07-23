/**
 * Basic usage examples for deep-pagination
 */

const deepPagination = require('deep-pagination');

console.log('=== Deep Pagination Examples ===\n');

// Example 1: E-commerce pagination
console.log('1. E-commerce: page 25 out of 50');
const ecommerce = deepPagination({ current: 25, max: 50 });
console.log('Pages:', ecommerce.pages.join(' '));
console.log('Has Previous:', ecommerce.hasPrevious);
console.log('Has Next:', ecommerce.hasNext);
console.log();

// Example 2: Large dataset
console.log('2. Large dataset: Page 500 of 2000');
const largeDataset = deepPagination({ current: 500, max: 2000 });
console.log('Pages:', largeDataset.pages.join(' '));
console.log();

// Example 3: Blog pagination with custom pad
console.log('3. Blog: Page 15 of 100 (pad=1)');
const blog = deepPagination({ current: 15, max: 100, pad: 1 });
console.log('Pages:', blog.pages.join(' '));
console.log();

// Example 4: Pagination with custom gap symbol
console.log('4. Pagination with custom gap symbol');
const customGap = deepPagination({
  current: 75,
  max: 200,
  pad: 2,
  gapSymbol: '-'
});
console.log('Pages:', customGap.pages.join(' '));
console.log('Has Previous:', customGap.hasPrevious);
console.log('Has Next:', customGap.hasNext);
console.log('Current Page:', customGap.currentPage);
console.log('Total Pages:', customGap.totalPages);
console.log();

// Example 5: Edge cases
console.log('5. Edge cases');
const firstPage = deepPagination({ current: 1, max: 100 });
console.log('First page:', firstPage.pages.slice(0, 10).join(' '), '...');

const lastPage = deepPagination({ current: 100, max: 100 });
console.log('Last page:', lastPage.pages.slice(-10).join(' '));

const smallDataset = deepPagination({ current: 3, max: 5 });
console.log('Small dataset:', smallDataset.pages.join(' '));
console.log();

// Example 6: Custom jump values for e-commerce
console.log('6. Custom jump values for e-commerce');
const customJumps = deepPagination({
  current: 75,
  max: 200,
  pad: 2,
  jumpValues: [500, 100, 50, 25, 10, 5, 1]
});
console.log('Custom strategy:', customJumps.pages.join(' '));
console.log();

// Example 7: Advanced with custom jumps and gap symbol
console.log('7. Advanced pagination with custom jump values');
const advancedCustom = deepPagination({
  current: 150,
  max: 1000,
  pad: 1,
  gapSymbol: '...',
  jumpValues: [2000, 500, 100, 50, 25, 10, 1]
});
console.log('Pages:', advancedCustom.pages.join(' '));
console.log();

// Example 8: SEO-friendly deep pages
console.log('8. SEO-friendly deep page access');
const deepPage = deepPagination({ current: 5000, max: 10000 });
console.log('Deep page navigation:', deepPage.pages.join(' '));
console.log('Crawler can reach page 5000 through strategic jumps!');
console.log();

// Example 9: Minimal configuration (using all defaults)
console.log('9. Minimal configuration (defaults: pad=2, gapSymbol="…")');
const minimal = deepPagination({ current: 42, max: 100 });
console.log('Minimal config:', minimal.pages.join(' '));
console.log();

// Example 10: Zero padding for compact pagination
console.log('10. Zero padding for very compact pagination');
const compact = deepPagination({ current: 50, max: 200, pad: 0 });
console.log('Compact:', compact.pages.join(' '));
console.log();

// Example 11: Large padding for extended navigation
console.log('11. Large padding for extended navigation');
const extended = deepPagination({ current: 50, max: 200, pad: 5 });
console.log('Extended:', extended.pages.join(' '));

// Display result structure for documentation
console.log('\n=== Result Structure ===');
const example = deepPagination({ current: 10, max: 50 });
console.log('Result object structure:');
console.log({
  pages: example.pages,
  hasPrevious: example.hasPrevious,
  hasNext: example.hasNext,
  totalPages: example.totalPages,
  currentPage: example.currentPage
});

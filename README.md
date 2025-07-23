# Deep Pagination

Intelligent pagination generator with multi-level deep pages, optimized for SEO-friendly crawling while maintaining excellent user experience.

## Features

- **Smart Gap Detection**: Intelligently places gaps (`…`) to avoid showing too many consecutive pages
- **Multi-Level Jump Values**: Configurable jump patterns for large datasets (50k, 25k, 10k, etc.)
- **SEO Optimized**: Ensures search engine crawlers can efficiently navigate deep pagination
- **Responsive Design Ready**: Adapts pagination complexity based on available space
- **Performance Focused**: Optimized algorithms for handling millions of pages
- **User Experience**: Maintains usability while providing deep navigation options

## Installation

```bash
npm install deep-pagination
# or
yarn add deep-pagination
# or
pnpm add deep-pagination
```

## Quick Start

```typescript
import deepPagination from 'deep-pagination';

const result = deepPagination({
  current: 1250,
  max: 50000
});

console.log(result.pages);
// Output: [1, 250, 500, 1000, "…", 1248, 1249, 1250, 1251, 1252, "…", 5000, 10000, 50000]
```

## API Reference

### `deepPagination(options: PaginationOptions): PaginationResult`

Generates smart pagination with intelligent gap placement and multi-level navigation.

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `current` | `number` | - | Current page number (1-based) **Required** |
| `max` | `number` | - | Maximum number of pages **Required** |
| `pad` | `number` | `2` | Number of additional pages to show around current page |
| `gapSymbol` | `string` | `'…'` | Symbol used to represent gaps in pagination |
| `jumpValues` | `number[]` | `[50000, 25000, ...]` | Custom jump values for multi-level pagination |

#### Return Value

```typescript
interface PaginationResult {
  pages: (number | string)[];     // Array of page numbers and gap symbols
  hasPrevious: boolean;           // Whether there are pages before current
  hasNext: boolean;               // Whether there are pages after current
  totalPages: number;             // Total number of pages
  currentPage: number;            // Current page number
}
```

## Examples

### Basic Usage

```typescript
import deepPagination from 'deep-pagination';

// Simple pagination
const basic = deepPagination({
  current: 5,
  max: 100
});

console.log(basic.pages);
// [1, 2, 3, 4, 5, 6, 7, '…', 10, 11, 15, 20, 25, 50, 100]
```

### Large Dataset with Custom Padding

```typescript
// Handle large datasets with more context
const largePagination = deepPagination({
  current: 15000,
  max: 1000000,
  pad: 3 // Show 3 pages on each side of current
});

console.log(largePagination.pages);
// [1, 3000, 4000, 5000, 10000, '…', 14997, 14998, 14999, 15000, 15001, 15002, 15003, '…', 20000, 30000, 50000, 100000, 1000000],
```

### Custom Jump Values

```typescript
// E-commerce with custom jump pattern
const customJumps = deepPagination({
  current: 250,
  max: 10000,
  jumpValues: [1000, 500, 100, 50, 25, 10, 5, 1]
});

console.log(customJumps.pages);

// [1, 50, 100, 200, '…', 248, 249, 250, 251, 252, '…', 300, 500, 1000, 10000],
```

### Small Dataset (Auto-simplification)

```typescript
// Automatically simplifies for small page counts
const simple = deepPagination({
  current: 3,
  max: 8
});

console.log(simple.pages);
// [1, 2, 3, 4, 5, 6, 7, 8] - No gaps needed
```

## Advanced Configuration

### Default Jump Values

The library uses intelligent jump values optimized for various dataset sizes:

```typescript
const DEFAULT_JUMP_VALUES = [50000, 25000, 10000, 5000, 1000, 500, 250, 100, 50, 25, 10, 5, 1];
```

### Custom Gap Symbol

```typescript
const withCustomGap = deepPagination({
  current: 50,
  max: 1000,
  gapSymbol: '...'
});
```

## Use Cases

### E-commerce Product Listings
```typescript
// Handle large product catalogs
const productPagination = deepPagination({
  current: parseInt(searchParams.page) || 1,
  max: Math.ceil(totalProducts / productsPerPage),
  pad: 2
});
```

### Search Results
```typescript
// Search engine result pages
const searchPagination = deepPagination({
  current: currentPage,
  max: Math.min(maxAllowedPages, totalResults / resultsPerPage),
  jumpValues: [1000, 500, 100, 50, 25, 10, 5, 1]
});
```

### Blog Archives
```typescript
// Blog post pagination with SEO optimization
const blogPagination = deepPagination({
  current: page,
  max: Math.ceil(totalPosts / postsPerPage),
  pad: 1, // Minimal padding for cleaner look
  jumpValues: [500, 250, 100, 50, 25, 10, 5, 1]
});
```

## SEO Benefits

- **Deep Crawling**: Allows search engines to discover content deep within large datasets
- **Efficient Navigation**: Reduces the number of clicks needed to reach any page
- **Link Distribution**: Spreads link equity across multiple levels of pagination
- **Crawl Budget Optimization**: Provides strategic entry points for crawler navigation

## Performance Considerations

- **Memory Efficient**: Generates pagination arrays without storing intermediate states
- **CPU Optimized**: Uses efficient algorithms that scale with dataset size
- **Minimal Dependencies**: Zero external dependencies for maximum compatibility
- **Tree Shakeable**: Only includes the functions you actually use

## Error Handling

The library includes comprehensive input validation:

```typescript
// Throws descriptive errors for invalid inputs
deepPagination({
  current: 0,    // Error: Current page must be a positive integer
  max: -5        // Error: Max pages must be a positive integer
});

deepPagination({
  current: 100,
  max: 50        // Error: Current page cannot be greater than max pages
});
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

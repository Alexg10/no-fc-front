# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
pnpm dev              # Start development server (localhost:3000)
pnpm build            # Build production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm type-check       # Run TypeScript checks
pnpm check            # Run lint + type-check
pnpm clean            # Remove .next build directory
pnpm fresh-install    # Clean install (remove node_modules, reinstall)

# Generators
pnpm component        # Interactive component generator (creates src/components/*)
pnpm page            # Interactive page generator (creates src/app/[locale]/*)
pnpm translation     # Interactive translation generator (creates messages/{en,fr}/*)
```

## High-Level Architecture

### Dual-API Pattern: Shopify + Strapi

This is a **hybrid e-commerce frontend** that combines:

- **Shopify Storefront API (GraphQL)** - Product catalog, pricing, variants, checkout
- **Strapi CMS (REST)** - Content enrichment, homepage configuration, metadata customization

Data flows from both APIs in **parallel** for performance:

```typescript
// Pattern: Fetch both APIs simultaneously, merge on server
const [shopifyProduct, strapiProduct] = await Promise.all([
  getShopifyProduct(handle),
  getStrapiProduct(handle, locale),
]);
```

### Server vs Client Component Boundary

The app uses **React Server Components as the default**:

- **Server Components**: All page components, data fetching, secure API handling
- **Client Components** (`"use client"`): Cart context, filters, interactive UI, language switching
- **Suspense Boundaries**: Used for progressive rendering (Hero section, product blocks, etc.)

Key server component pattern:
```typescript
// Server: async, fetches data
async function ProductsContent({ locale, searchParams }) {
  const products = await getProducts(searchParams);
  return <ProductGrid products={products} />;
}

// Client: interactive only
"use client"
function ProductFilters({ onChange }) {
  const [sort, setSort] = useState("RELEVANCE");
  return <SortSelect value={sort} onChange={onChange} />;
}
```

### Internationalization (next-intl)

- **Locales**: French (default, no prefix) and English (`/en`)
- **Locale routing**: Automatic via middleware
- **Message structure**: `messages/{locale}/{namespace}.json`
- **Fallback**: English locale falls back to French if key missing

Getting translations in components:
```typescript
// Server: async
const t = await getTranslations({ locale, namespace: "products" });

// Client: hook
const t = useTranslations("common");
```

### Error Handling

- **Error Boundaries** at route level: `[locale]/products/error.tsx`
- **Graceful API degradation**: Strapi missing → use Shopify data only
- **Locale fallbacks**: EN not found → use FR → use default
- **404 handling**: `notFound()` for missing products/collections

## Project Structure

```
src/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout (fonts, metadata)
│   └── [locale]/                     # Dynamic locale routing
│       ├── layout.tsx                # Locale layout (i18n provider, cart context)
│       ├── page.tsx                  # Homepage with Suspense boundaries
│       ├── products/
│       │   ├── page.tsx              # Products listing (server)
│       │   ├── error.tsx             # Error boundary
│       │   └── [handle]/page.tsx     # Single product detail
│       └── collections/[handle]/     # Collection pages
│
├── components/
│   ├── ui/                           # Radix UI + utility components (ProductCard)
│   ├── common/                       # Header, Footer, Language Switcher
│   ├── products/                     # Filter, Pagination, Product listing
│   │   └── _components/              # Sub-components (CollectionFilter, SortControl, etc.)
│   ├── dynamic-blocks/               # CMS block renderers (HomeProductsBlock, etc.)
│   ├── skeleton/                     # Loading placeholders
│   ├── error-boundary.tsx            # Error UI component
│   └── cart-sheet.tsx                # Shopping cart UI
│
├── lib/
│   ├── shopify.ts                    # Shopify GraphQL client + product queries
│   ├── strapi.ts                     # Strapi REST client + generic fetching
│   ├── products.ts                   # Hybrid product fetching (Shopify + Strapi)
│   ├── navigation.ts                 # next-intl Link wrapper
│   ├── metadata.ts                   # Dynamic metadata generation
│   └── utils.ts                      # Utilities (cn, etc.)
│
├── services/
│   └── strapi/menuService.ts         # Service layer for specific API entities
│
├── types/
│   ├── strapi.ts                     # Strapi entity types (Homepage, Block, Product)
│   └── strapi/                       # Specific domain types (menu, blocks)
│
├── contexts/
│   └── cart-context.tsx              # Cart state + localStorage persistence
│
├── middleware.ts                     # Locale detection and routing
├── i18n.ts                           # Dynamic message loading
└── routing.ts                        # next-intl routing config
```

## Key Patterns

### Data Fetching Architecture

**Service Layer Pattern**
```typescript
// /src/services/strapi/menuService.ts
async function getMenu() {
  const query = qs.stringify({ populate: { links: {...} } });
  const result = await strapiFetch(`/menu?${query}`);
  return result.data?.data;
}
```

**Library Pattern** (Reusable functions)
```typescript
// /src/lib/products.ts
const [shopifyProduct, strapiProduct] = await Promise.all([
  getShopifyProduct(handle),
  getStrapiProduct(handle, locale),
]);
```

**Caching Strategy**
- API responses: `revalidate: 60` (ISR - Incremental Static Regeneration)
- Stable content (menu): `revalidate: 86400` (24 hours)
- Dynamic routes: `notFound()` for 404s

### Component Decomposition

**Avoiding Code Duplication**
The project uses a reusable `ProductCard` component (`src/components/ui/product-card.tsx`) used in multiple places:
- Products listing page
- Collections page
- Homepage products block

Pattern:
```typescript
<ProductCard
  product={product}
  isAboveFold={index < 8}  // Priority loading for first 8
/>
```

**Filter Component Pattern**
`ProductsFilters` is decomposed into smaller sub-components for maintainability:
- `CollectionFilter` - Collection selector
- `SortControl` - Sorting options
- `PriceRangeFilter` - Min/max price inputs
- `AvailabilityFilter` - Stock availability checkbox

Each sub-component owns its state and onChange callback.

### Image Optimization

```typescript
<Image
  src={url}
  alt={altText || productTitle}
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  loading={isAboveFold ? "eager" : "lazy"}
  priority={isAboveFold}  // Only first 8 products
  placeholder="blur"
/>
```

### Suspense for Streaming HTML

Homepage renders in stages:
```typescript
<Suspense fallback={<HeroSkeleton />}>
  <HomeHero locale={locale} />
</Suspense>

<Suspense fallback={<BlockSkeleton />}>
  <HomeBlocks locale={locale} />
</Suspense>
```

### Type Safety

All external data is typed:
- Shopify responses imported from GraphQL types
- Strapi responses validated against types in `src/types/strapi.ts`
- Cart operations use strict Cart/CartLine types

## Important Implementation Details

### Locale Handling

Always accept locale as a string parameter in Server Components:
```typescript
// pages/[locale]/products/page.tsx
export default async function ProductsPage({ params }: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;  // Next.js 15+ async params
  // ...
}
```

Strapi has **locale fallback chain**:
1. Try requested locale
2. If 404 and locale !== "fr", try French
3. If still 404, try default

### Cart Context

Cart state only available inside `CartProvider` (in locale layout):
```typescript
// Available in any client component inside [locale] route
"use client";
const { cart, addLine, updateQuantity } = useCart();
```

Cart ID persists in localStorage as `shopify_cart_id`.

### Adding New Dynamic Blocks

To add a new CMS block type from Strapi:

1. **Define Type** in `src/types/strapi.ts`:
```typescript
export interface StrapiCustomBlock {
  __component: "blocks.custom";
  id: string;
  // ... fields
}

export type StrapiBlock = StrapiCenteredText | StrapiHomeProducts | StrapiCustomBlock;
```

2. **Create Component** in `src/components/dynamic-blocks/custom-block.tsx`:
```typescript
export async function CustomBlock({ block }: { block: StrapiCustomBlock }) {
  return <div>{/* render block */}</div>;
}
```

3. **Register in BlockRenderer** (`src/components/common/block-renderer.tsx`):
```typescript
case "blocks.custom":
  return <CustomBlock block={block} />;
```

### Remote Image Sources

Configure new CDNs in `next.config.ts`:
```typescript
remotePatterns: [
  { protocol: "https", hostname: "cdn.shopify.com" },
  { protocol: "https", hostname: "strapi.example.com" },
],
```

## Code Conventions

- **TypeScript**: All files must be `.tsx` or `.ts`
- **Components**: PascalCase, in dedicated files
- **Styling**: Tailwind CSS with utility-first approach
- **UI Components**: Use Radix UI primitives when available
- **Imports**: Use `@/` alias for src/ imports
- **API Calls**: Always in Server Components or service layer
- **Error Handling**: Try-catch in service functions, error boundaries at page level
- **Null Handling**: Use optional chaining and nullish coalescing

## Performance Optimizations Already Implemented

These are baseline optimizations in the codebase:

1. **Parallel Data Fetching**: Collections and products fetched together with `Promise.all()`
2. **Reusable Components**: ProductCard eliminates duplication
3. **Suspense Boundaries**: Homepage renders progressively with skeleton fallbacks
4. **Error Boundaries**: Graceful error handling on product/collection pages
5. **Image Lazy Loading**: Below-fold images lazy loaded
6. **Component Decomposition**: Large client components split into focused sub-components

## Environment Variables

```env
# Shopify
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=public_token

# Strapi
STRAPI_URL=http://localhost:1337  # or production URL
STRAPI_API_TOKEN=optional_private_token

# Site Config
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## When to Use Claude Code Features

- **Code searches**: Use when finding specific functions or patterns
- **Component extraction**: `/extract-component` to split large components
- **Optimization review**: `/optimize` analyzes performance
- **Strapi services**: `/service` generates API service functions
- **Commits**: `/commit` with gitmoji formatting

## ⚠️ IMPORTANT RULE: Commit Validation Required

**MANDATORY**: Claude MUST NEVER commit automatically without explicit user validation.

**Required Process**:
1. Claude PREPARES changes (stages files, drafts message)
2. Claude DISPLAYS what will be committed (diff, message, files)
3. Claude ASKS for explicit confirmation from user
4. User VALIDATES or REFUSES the commit
5. Only after user approval does Claude execute `git commit`

**When in doubt**: Ask permission before committing, never assume.

**No exceptions**: All commits require user approval.

## Useful Links

- [Next.js 16 Docs](https://nextjs.org/docs)
- [React Server Components](https://react.dev/reference/rsc/server-components)
- [next-intl Docs](https://next-intl-docs.vercel.app/)
- [Shopify Storefront API](https://shopify.dev/docs/api/storefront)
- [Strapi Docs](https://docs.strapi.io/)

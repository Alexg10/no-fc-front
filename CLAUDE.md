# No-FC Front - Project Commands

## Development Commands
- `pnpm dev` - Start development server
- `pnpm build` - Build production
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript checks

## Common Tasks
- New component: Create in `src/components/` with TypeScript
- New page: Create in `src/app/[locale]/` for i18n support
- Translations: Add to `messages/en/` and `messages/fr/`
- Strapi types: Update in `src/types/strapi/`

## Project Structure
- Frontend: Next.js 16 with TypeScript
- Styling: Tailwind CSS
- UI: Radix UI components
- Backend: Strapi CMS
- E-commerce: Shopify integration
- i18n: next-intl (EN/FR)

## Code Conventions
- Use TypeScript for all files
- Components in PascalCase
- Use Tailwind for styling
- Follow existing patterns in components/
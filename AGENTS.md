# Repository Guidelines

## Project Structure & Module Organization

- `app/`: Next.js routes, layouts, and pages.
- `components/`: Reusable UI and feature components (TypeScript, mostly PascalCase files).
- `lib/`: Utilities, helpers, and shared logic.
- `db/`: Drizzle ORM schema/migrations and DB utilities.
- `actions/`: Server actions and API-adjacent logic.
- `types/`: Shared TypeScript types.
- `public/`: Static assets.
- `__tests__/`: Unit and component tests.

## Build, Test, and Development Commands

- `npm run dev`: Start local dev server with type-checking.
- `npm run build`: Type-check and build the Next.js app.
- `npm start`: Run the production build locally.
- `npm test` | `npm run test:watch` | `npm run test:coverage`: Run Jest tests, watch mode, or coverage.
- `npm run lint` | `npm run lint:fix`: Lint code (Next + ESLint) and auto-fix.
- `npm run format:write`: Format with Prettier.
- `npm run db:migrate` | `npm run db:generate`: Drizzle migrations and SQL generation.

## Coding Style & Naming Conventions

- Language: TypeScript. Indent 2 spaces; no semicolons (`semi: false`).
- Prettier enforced (see `prettier.config.cjs`); import order configured.
- ESLint: `next/core-web-vitals`, `@typescript-eslint`, `eslint-plugin-tailwindcss`.
- Components/files: Prefer PascalCase for React components, kebab- or lowercase for folders.
- Unused vars prefixed with `_` allowed per lint rules.

## Testing Guidelines

- Framework: Jest + jsdom with React Testing Library.
- Location: `__tests__/` mirroring source; name files `*.test.ts`/`*.test.tsx`.
- Coverage: Enabled by default; output in `coverage/` with text summary.
- Run locally: `npm test` (CI expects tests and types to pass).

## Commit & Pull Request Guidelines

- Use Conventional Commits where possible: `feat:`, `fix:`, `chore:`, `docs:`, etc. (repo history includes `chore(deps): bump ...`).
- Branches: short, descriptive names (e.g., `feat/runtime-metrics`, `fix/card-a11y`).
- PRs: clear description, linked issues (e.g., `Closes #123`), screenshots for UI, and notes on tests/migrations.
- Quality gate: run `npm run lint:fix`, `npm run format:write`, and `npm test` before opening a PR. A Husky pre-commit hook runs lint+format.

## Security & Configuration Tips

- Copy `.env.example` to `.env.development.local`; never commit secrets.
- Sync env from Vercel when applicable: `vercel env pull .env.development.local`.
- Required engines: Node `22.11.0`, npm `10.9.0` (see `package.json`).

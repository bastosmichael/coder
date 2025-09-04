# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Next.js App Router routes, layouts, and API handlers.
- `components/`: Reusable UI components; colocate styles with components.
- `lib/`: Utilities, helpers, and SDK wrappers.
- `db/`: Drizzle ORM schema and migrations; see `drizzle.config.ts`.
- `actions/`: Server actions and side‑effectful handlers.
- `types/`: Shared TypeScript types.
- `__tests__/`: Jest/RTL tests. Static assets in `public/`.

## Build, Test, and Development Commands
- `npm run dev`: Type checks then starts Next.js dev server.
- `npm run build`: Type checks and builds the production bundle.
- `npm start`: Serves the built app.
- `npm run test` | `test:watch` | `test:coverage`: Run Jest tests and coverage.
- `npm run lint` | `lint:fix`: Lint code (ESLint + Next rules).
- `npm run format:write`: Apply Prettier formatting.
- DB: `npm run db:generate`, `npm run db:migrate` (Drizzle).

## Coding Style & Naming Conventions
- TypeScript first; 2‑space indent, no semicolons, double quotes (Prettier).
- Components: `PascalCase.tsx`; hooks/utils: `camelCase.ts`.
- Prefer named exports for shared modules; keep files focused and small.
- Follow ESLint guidance; fix warnings before committing.

## Testing Guidelines
- Framework: Jest + `@testing-library/react` (JSDOM env).
- Location: `__tests__/*.test.tsx` (e.g., `Button.test.tsx`).
- Coverage is collected to `coverage/`; include tests for new features and bug fixes.
- Use `npm run test:watch` during development.

## Commit & Pull Request Guidelines
- Conventional Commits (e.g., `feat:`, `fix:`, `chore:`). Example: `feat(ui): add Toggle component`.
- PRs: clear description, linked issues, screenshots/GIFs for UI, test notes.
- Ensure CI passes: build, type‑check, lint, and tests.

## Security & Configuration
- Copy `.env.example` to `.env.local` for local dev; never commit secrets.
- Only expose safe client vars with `NEXT_PUBLIC_`. Validate inputs with `zod` where applicable.

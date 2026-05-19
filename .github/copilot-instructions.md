# Project Guidelines

OctoCAT Supply — a supply chain management demo app showcasing GitHub Copilot capabilities. Cat-themed product catalog with full-stack CRUD operations.

## Architecture

- **Monorepo** with npm workspaces: `api/` (Express + TypeScript) and `frontend/` (React + Vite + Tailwind CSS)
- **API** serves REST endpoints at `/api/*` with in-memory data from `seedData.ts` — no database
- **Frontend** uses React Router v7, react-query for data fetching, axios as HTTP client
- **Auth** is mock-only via React Context (`@github.com` emails get admin); no real backend auth
- See [docs/architecture.md](docs/architecture.md) for ERD and full design

## Build and Test

```bash
npm install                          # Install all workspaces
npm run dev                          # API (port 3000) + Frontend (port 5137) concurrently
npm run build --workspace=api        # Compile API (tsc → dist/)
npm run build --workspace=frontend   # Build Frontend (tsc + vite)
npm run test                         # All tests (Vitest)
npm run test:api                     # API tests only
npm run lint                         # ESLint (frontend only)
```

Swagger UI available at `http://localhost:3000/api-docs`.

## Code Style

- **TypeScript strict mode** in both workspaces; do not use `any`
- **Models** are interfaces in `api/src/models/` with JSDoc Swagger annotations — these are the source of truth for types
- **Route files** must include Swagger JSDoc comment blocks before the router code
- **Frontend components** use PascalCase filenames; support dark mode via `useTheme()` hook and Tailwind `dark:` classes
- **Tests** are collocated with source files (e.g., `branch.test.ts` next to `branch.ts`)

## Conventions

### API Routes

Every route file in `api/src/routes/` follows this pattern — use [branch.ts](api/src/routes/branch.ts) as the canonical example:

1. Swagger JSDoc block at top of file
2. Import Express, model interface, and seed data
3. Create `express.Router()` with in-memory array from seed data
4. Standard CRUD: `GET /`, `POST /` (201), `GET /:id` (404 if missing), `PUT /:id`, `DELETE /:id` (204)
5. Export a `resetData()` function for test isolation
6. Export default router

When adding a new entity: create model in `models/`, add seed data in `seedData.ts`, create route file following the pattern above, and register the route in `index.ts`.

### Frontend Components

- Data fetching: `useQuery('key', fetchFn)` from react-query; API config from `src/api/config.ts`
- State: React Context for auth (`AuthContext`) and theme (`ThemeContext`); local `useState` for UI state
- Styling: Tailwind CSS with custom primary color `#76B852`; always support dark mode
- New entity pages go in `components/entity/<name>/`

### Naming

- API endpoints: kebab-case (`/api/order-detail-deliveries`)
- Model files: singular (`product.ts`)
- Component files: PascalCase (`ProductForm.tsx`)
- Test files: `<source>.test.ts` collocated with source

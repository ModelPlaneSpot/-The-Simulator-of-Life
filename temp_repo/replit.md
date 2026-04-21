# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

- `artifacts/the-simulator-of-life`: React + Vite life simulator game served at `/`. Package name must remain `@workspace/the-simulator-of-life` because the artifact workflow filters on that package name.
- The simulator uses Tailwind v4 through the existing Vite setup. Avoid reintroducing `react-router-dom`, `lovable-tagger`, or Tailwind v3-only config unless dependencies are intentionally added.

## Recent Simulator Changes

- Imported the upstream simulator source into the `the-simulator-of-life` artifact.
- Added minimal gameplay improvements in `src/game/LifeSimulator.tsx`: safe money/debt clamping, small income/expense randomness, low-cash warnings, best available job highlighting, compact stats summary, cleaner finance/job/inheritance messages, activity-log summary, and toast notifications for major events.
- Vite is configured to use `PORT`, `BASE_URL`, and `allowedHosts: true` for Replit preview compatibility.

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/the-simulator-of-life run dev` — run the simulator web app

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

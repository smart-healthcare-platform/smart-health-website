# Conventions

## Naming
- Use `kebab-case` for files and folders in React/Next apps.
- Components live under `src/components/**` and are `PascalCase` component names but file names remain `kebab-case` (e.g. `user-card.tsx`).
- Avoid abbreviations; use complete descriptive names.

## Directories
- `src/app/**`: route segments only; pages and route-level layouts.
- `src/components/common/**`: cross-domain, reusable building blocks.
- `src/components/ui/**`: low-level UI primitives (buttons, inputs, dialogs, pagination).
- `src/services/**`: API clients and side-effectful service calls (axios instances live in `src/lib`).
- `src/hooks/**`: React hooks, pure and reusable.
- `src/redux/**`: state slices, selectors, store setup.
- `src/types/**`: TypeScript types only.
- `src/lib/**`: framework-agnostic utilities and clients (`axios.ts`, `format.ts`, etc.).

## Imports
- Use path alias `@/*` for all internal imports.
- Never import across route segments using relative `../../..` when alias is available.

## Components
- Client components explicitly declare `'use client'` when needed.
- Keep components focused; extract subcomponents when they exceed ~200 lines.
- Place co-located styles or minor helpers next to the component, but shared logic should move to `common`/`hooks`.

## Comments
- Write comments in English only; focus on rationale, edge cases, constraints.
- Do not duplicate what the code already expresses clearly.

## API/Services
- Services return typed data and never mutate global state.
- All network errors are surfaced to callers; do not swallow errors silently.

## Files recently normalized
- Renamed `components/comon/**` to `components/common/**`.
- Renamed `components/ui/gloab-pagination.tsx` to `components/ui/global-pagination.tsx`.
- Renamed `components/ui/confirm-end-examition.tsx` to `components/ui/confirm-end-examination.tsx`.
- Converted comments in `src/lib/axios.ts` to English.

## Testing
- Prefer integration-level tests at route/page boundaries.




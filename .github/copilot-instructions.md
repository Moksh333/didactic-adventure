## Quick orientation

This is a Next.js (app-router) frontend project scaffolded with create-next-app and TypeScript.

- App root: `app/` — pages and layouts use the app-router conventions (see `app/layout.tsx`, `app/page.tsx`).
- UI primitives: `components/ui/` (e.g., `button.tsx`, `card.tsx`, `input.tsx`) — components follow a small design-system pattern using `class-variance-authority` (cva) and a `cn` helper in `lib/utils.ts`.
- Path alias: `@/*` is mapped to the repo root via `tsconfig.json`.

## What to change and how

- Adding a new route: create `app/<route>/page.tsx` (or a nested folder). Use `export default function Page()` and prefer the `app` folder conventions.
- Adding UI primitives:
  - Place component files under `components/ui/`.
  - Use `cn(...)` from `lib/utils.ts` to merge Tailwind classnames.
  - For variant-based styles use `cva(...)` and expose VariantProps (see `components/ui/button.tsx`).
  - Add `data-slot` attributes where appropriate (existing components use them for tooling/targeting).

## Scripts & common commands

- Dev server: `npm run dev` (starts Next dev server on :3000).
- Build for production: `npm run build`.
- Run production server: `npm run start` (after build).
- Lint: `npm run lint` (project uses `eslint.config.mjs`).
- Type-checking: run `npx tsc --noEmit` if you want only type checks outside of a Next build. Note: `next build` also performs type checking.

## Conventions and patterns you should follow

- Client vs Server components: Files needing browser APIs or hooks include "use client" at the top (see `app/page.tsx`). Keep server components server-only when possible.
- Styling: Tailwind utility classes are the primary styling approach. Prefer composable utility classes and `cn(...)` to combine classes.
- Design tokens & fonts: Global font variables are set in `app/layout.tsx` using `next/font`; prefer using those CSS variables when adding text styles.
- Component API shape: UI components are small, exported as named exports (e.g., `Button`, `Input`) and accept `className` plus native HTML props.

## Integration points & dependencies

- Major libs to be aware of:
  - Tailwind CSS + `tailwind-merge` (class merging)
  - `class-variance-authority` for variants
  - `@radix-ui/react-slot` for `asChild` patterns
  - `lucide-react` for icons
- No server/API routes are present in the repo root — the project is currently a static/front-end app. If you add API routes, prefer Next API routes (`app/api` or `pages/api` depending on router choice).

## Debugging tips specific to this repo

- Inspect UI elements using the `data-slot` attributes (e.g., `data-slot="button"`/`card`/`input`) to find primitives quickly in the browser devtools.
- When changing component variants, update the `cva` definition in the component file (e.g., `components/ui/button.tsx`) and run the dev server; Tailwind JIT will pick up class usage in JSX.

## Minimal examples (copy/paste friendly)

- Add a new variant to the Button component:

  - Edit `components/ui/button.tsx` → extend `buttonVariants` with a new `variant: { accent: "bg-accent text-white" }` entry and use `<Button variant="accent">`.

- Create a new page route:

  - Create `app/faq/page.tsx` with a default exported React component; no special routing setup needed.

## Files to consult for examples

- `app/layout.tsx` — global layout, font variables, global CSS import (`globals.css`).
- `app/page.tsx` — a practical client component using `use client`, local state, and the UI primitives.
- `components/ui/button.tsx`, `card.tsx`, `input.tsx` — canonical component patterns (cva, cn, data-slot).
- `lib/utils.ts` — `cn` helper used across UI components.
- `package.json` — scripts and dependency list (Next 16, React 19, Tailwind 4).
- `eslint.config.mjs` & `tsconfig.json` — project linting and TS config (paths, strict mode).

---

If any of these sections are missing detail you need, tell me which area you want expanded (examples, commands, or a short onboarding checklist) and I will iterate. 

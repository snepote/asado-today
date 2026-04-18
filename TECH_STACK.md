# TECH_STACK.md

## Core
- SvelteKit (Svelte 5 with runes) + TypeScript
- Vite as the dev server / bundler (comes with SvelteKit)
- Tailwind CSS v4 for styling — mobile-first by default, pairs extremely well with Claude Code since Claude reads and writes utility classes fluently
- `shadcn-svelte` for accessible, copy-paste UI primitives (or Skeleton UI as an alternative)

| Layer | Tool | Notes |
|---|---|---|
| Framework | **SvelteKit** | Svelte 5 with runes (`$state`, `$derived`, `$effect`) — never legacy stores syntax |
| Language | **TypeScript** | `strict: true` always on |
| Bundler | **Vite** | Comes with SvelteKit, do not replace |
| Styling | **Tailwind CSS v4** | Mobile-first utility classes. No custom CSS files unless unavoidable |
| UI primitives | **shadcn-svelte** | Copy-paste, accessible. Own the code |
| Runtime | **Cloudflare Workers** | Not Pages. Not Node. Not Deno |
| Adapter | `@sveltejs/adapter-cloudflare` | Outputs to `.svelte-kit/cloudflare/` |
| Database | **D1** (SQLite at edge) | Via `platform.env.DB` |
| Key-value | **KV** | For config, sessions, cache |
| Object storage | **R2** | For files, images, audio |
| Realtime/state | **Durable Objects** | For WebSockets and shared state |
| CI/CD | **Workers Builds** | Git-connected, preview URL per PR |
| PWA (optional) | `@vite-pwa/sveltekit` | Only if the app is offline-capable or installable |

**Package manager: pnpm.** Never commit with `npm` or `yarn` lockfiles present.

## Cloudflare platform services (use as needed)
- Workers — compute + static assets, single deployment
- D1 — SQLite at the edge, for relational data
- KV — key-value for config, sessions, cache
- R2 — S3-compatible object storage, no egress fees
- Durable Objects — for WebSockets, real-time collaboration, stateful logic
- Workers Builds — Git-connected CI/CD with automatic preview URLs per PR

## Testing (end-to-end focus, per your requirement)
- Playwright — E2E, cross-browser, runs in CI. Gold standard.
- Vitest — unit/integration, native Vite integration, fast
- MSW — API mocking for component tests
- Run Playwright against wrangler dev locally and against preview URLs in CI for true end-to-end coverage including Workers runtime behavior

## PWA (optional, and yes it makes sense here)
- `@vite-pwa/sveltekit` — handles service worker, manifest, offline caching, install prompts. Minimal config for a solid installable app.

## Fit additions
Durable Object per asado (the shared forecast state, attendee list, live updates via WebSocket to anyone with the page open). D1 persists the asado after the DO hibernates. KV still caches the per-geohash weather lookups — crucial now because each guest triggers their own lookup, and clustering by neighborhood means most are cache hits. Web Push for umbrella alerts and re-propose pings. Short URLs via a simple KV map.

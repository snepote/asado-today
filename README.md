# Asado Today

A mobile-first web app to help a group of people decide if they should make a BBQ on a given day, based on weather intelligence.

## Tech stack

- SvelteKit (Svelte 5 with runes) + TypeScript strict
- Tailwind CSS v4
- Cloudflare Workers + D1 + KV
- Open-Meteo weather API (free, no key required)

## Prerequisites

- Node.js 22.12+ (or 20.19+)
- pnpm

## Setup

```bash
pnpm install
```

## Running locally

### Quick UI preview (no D1/KV bindings)

```bash
pnpm dev
```

Opens at `http://localhost:5173`. The UI renders but server actions that need D1 or KV will fail.

### Full local environment (recommended)

1. Apply the D1 database migration:

```bash
pnpm wrangler d1 migrations apply DB --local
```

2. Build and start the Workers runtime:

```bash
pnpm build && pnpm wrangler dev
```

Opens at `http://localhost:8787` with real D1 and KV bindings.

### Testing the flow

1. Open `http://localhost:8787`
2. Enter your name, pick date/time, tap "Usar mi ubicacion"
3. Tap "Convocar" to create the event and see the weather verdict
4. Share the link or tap "Ver en vivo" for the live forecast page
5. Open the event link in another browser tab to test the guest RSVP flow

## Quality checks

```bash
pnpm agent:check    # Runs all checks: lint, typecheck, tests, build
```

Individual commands:

| Command | What it checks |
|---|---|
| `pnpm lint` | Biome — style, bugs, unused vars |
| `pnpm lint:svelte` | ESLint on `.svelte` files |
| `pnpm typecheck` | svelte-check + tsc |
| `pnpm test:unit` | Vitest unit tests |
| `pnpm build` | Production build |

## License

Apache-2.0

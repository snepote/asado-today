# Code quality

## Instructions for AI coding agents working in this repository
> Read this file before making changes. Run `pnpm agent:check` before considering any task complete.

### 2. Non-negotiable rules

#### Svelte 5
- Use runes: `let count = $state(0)`, not `let count = 0` with reactive `$:` declarations.
- Derived state: `const doubled = $derived(count * 2)`.
- Side effects: `$effect(() => { ... })`.
- Props: `let { name, age = 18 } = $props<{ name: string; age?: number }>()`.
- **Never** use `<script context="module">` unless you have a specific, justified reason.

#### TypeScript
- `strict: true` — no `any`, no implicit returns, no unchecked indexed access.
- Type all function signatures at module boundaries. Internal helpers can infer.
- Use `satisfies` for config objects rather than `as`.
- Types for Cloudflare bindings live in `src/app.d.ts` under `App.Platform.Env`.

#### Cloudflare Workers
- Output directory is `.svelte-kit/cloudflare/` — **never** `dist/`. Tutorials that say `dist/` are outdated.
- `wrangler.jsonc` is strict JSON despite the extension — no trailing commas, no comments inside arrays.
- Always set `compatibility_date` to today's date or later when creating a new Worker.
- Add `"nodejs_compat"` to `compatibility_flags` only if a dependency requires it. Prefer Workers-native APIs.
- Access bindings via `platform.env` inside `load` / `action` / `+server.ts`:
  ```ts
  export async function load({ platform }) {
    const db = platform?.env?.DB;
    // ...
  }
  ```

#### D1 (SQL)
- **Always** use parameterized queries. Never concatenate user input into SQL.
  ```ts
  // ✓ Correct
  await db.prepare('SELECT * FROM posts WHERE id = ?').bind(id).first();
  // ✗ Wrong — SQL injection
  await db.prepare(`SELECT * FROM posts WHERE id = ${id}`).first();
  ```
- Migrations live in `migrations/` and are applied via `wrangler d1 migrations apply`.
- Type query results explicitly; D1 returns `unknown`.

#### Secrets & config
- **Never** put secrets in `wrangler.jsonc`, source code, or any committed file.
- Development secrets: `.dev.vars` (gitignored).
- Production secrets: `wrangler secret put SECRET_NAME`.
- If you see a secret in the working tree, stop and flag it. Do not commit.

#### Styling
- Tailwind utilities only. No `style=` attributes for anything dynamic beyond trivial cases.
- Mobile-first: design at ~380px viewport, scale up with `sm:`, `md:`, `lg:` breakpoints.
- Dark mode via `dark:` variants from the start — don't retrofit.
- Never inline SVG icons larger than ~40 lines; extract to components.

#### State management
- Prefer URL state (search params, route params) over client state.
- Prefer server state (load functions) over client fetches.
- Use runes (`$state`) for local UI state only.
- Use stores only for genuine cross-component state; prefer context + runes otherwise.

#### Performance discipline
- No client-side fetch waterfalls. Fetch in `load`, pass data down.
- No unbounded lists without virtualization.
- No images without `width`/`height` attributes.
- No fonts without `font-display: swap`.
- No client-side routing for pages that could be SSR'd with cached data.

---

### 3. Project structure

```
src/
├── routes/              # SvelteKit file-based routing
│   ├── +layout.svelte
│   ├── +page.svelte
│   └── api/
│       └── [...]/+server.ts
├── lib/
│   ├── components/      # Reusable Svelte components (PascalCase.svelte)
│   ├── server/          # Server-only code (never imported by client)
│   │   ├── db/
│   │   └── auth/
│   ├── utils/           # Pure TypeScript utilities
│   └── types.ts         # Shared types
├── app.d.ts             # Ambient types, including App.Platform.Env
├── app.css              # Tailwind entry, minimal globals
└── app.html             # SvelteKit HTML shell

migrations/              # D1 migrations (numbered: 0001_init.sql)
tests/
├── e2e/                 # Playwright specs
└── unit/                # Vitest specs (colocated *.test.ts also fine)
static/                  # Served as-is (favicon, robots.txt)
wrangler.jsonc           # Cloudflare config
```

**Rules:**
- `src/lib/server/` is server-only. Importing it from a client component is a build error — keep it that way.
- One component per file. Filename matches the component name.
- Test files end in `.test.ts` (unit) or `.spec.ts` (e2e).

---

### 4. Self-assessment commands — run before declaring a task done

```bash
pnpm agent:check   # Runs all fast checks below in one shot
```

Individually:

| Command | What it checks | Typical runtime |
|---|---|---|
| `pnpm lint` | Biome — style, bugs, unused vars | < 2s |
| `pnpm lint:svelte` | ESLint on `.svelte` files | < 3s |
| `pnpm typecheck` | svelte-check + tsc | < 5s |
| `pnpm deadcode` | Knip — unused files, exports, deps | < 2s |
| `pnpm cycles` | madge — circular dependency detection | < 1s |
| `pnpm sec:secrets` | gitleaks — leaked credentials | < 1s |
| `pnpm sec:deps` | osv-scanner — vulnerable dependencies | < 2s |
| `pnpm sec:sast` | Semgrep — static security analysis | < 5s |
| `pnpm test:unit` | Vitest | varies |
| `pnpm test:e2e` | Playwright against `wrangler dev` | varies |
| `pnpm build` | Production build + size-limit | < 30s |

#### How to interpret failures

- **Biome / ESLint error**: Fix the code. Do not disable rules without justification in a comment.
- **Type error**: Fix types, not with `as any`. If the type system is genuinely wrong, use `// @ts-expect-error <reason>` with a reason.
- **Knip reports unused export**: Remove it unless it's a public API (document why).
- **Knip reports unused dependency**: Remove from `package.json`.
- **madge cycle**: Break the cycle. Extract shared code to a new module.
- **gitleaks hit**: Stop. Remove the secret, rotate it, never commit.
- **osv-scanner vuln**: Update the dependency. If no fix exists, document the mitigation.
- **Semgrep finding**: Treat as real. Common hits: unsafe regex, `eval`-like patterns, unsanitized HTML.
- **size-limit exceeded**: Either remove the bloat or justify raising the budget in the PR.
- **Playwright fails**: Fix the regression. Do not mark tests as `.skip` to get green.

---

### 5. Quality gates (enforced in CI)

| Gate | Threshold |
|---|---|
| Route JS bundle | < 30 KB per route |
| Worker bundle | < 1 MB total |
| Lighthouse Performance | ≥ 90 on preview URL |
| Lighthouse Accessibility | ≥ 95 |
| LCP | < 2.5s |
| CLS | < 0.1 |
| Test coverage (unit) | ≥ 70% lines on `src/lib/` |
| E2E happy path | Must pass on Chromium, Firefox, WebKit |

These are budgets, not suggestions. If a change blows a budget, the task isn't done.

---

### 6. Testing requirements

**Every new feature needs:**
- At least one unit test for pure logic (Vitest).
- At least one E2E test for the user-facing happy path (Playwright).
- No network calls to real services in unit tests — use MSW.

**Playwright E2E must run against `wrangler dev`**, not `vite dev`. This catches Workers runtime differences (missing APIs, binding issues, request/response shapes) before CI.

```bash
# Local E2E loop
pnpm wrangler dev &          # or use a vite plugin that does this
pnpm playwright test
```

**Do not disable or skip tests** to pass CI. If a test is flaky, fix it or mark it as a known issue in an ISSUES.md with a timeline.

---

### 7. Common mistakes to avoid

1. **Using `localStorage` in server code.** Doesn't exist in Workers. Use KV or Durable Objects.
2. **Calling `fetch` to your own API from a `load` function.** Call the function directly or query the DB — don't make a round trip.
3. **Putting heavy dependencies in the Worker bundle.** Every KB matters. Check with `size-limit` before adding.
4. **Forgetting `await` on D1 / KV / R2 calls.** They all return Promises. Biome's `noFloatingPromises` should catch this.
5. **Hardcoding URLs.** Use `$app/paths` (`base`, `assetsPrefix`) and environment variables.
6. **Mixing runes with legacy reactive syntax (`$:`).** Pick runes. Be consistent.
7. **Using `any` to escape a type problem.** Almost always the wrong fix. Model the type properly.
8. **Committing without running `pnpm agent:check`.** The pre-commit hook should catch it, but don't rely on that.

---

### 8. When in doubt

- **Framework question**: Check SvelteKit docs (`svelte.dev/docs/kit`). Do not invent APIs.
- **Cloudflare question**: Check `developers.cloudflare.com/workers`. Tutorials older than 2026 may reference deprecated Pages-specific patterns.
- **Design question**: Prefer simpler, fewer components. If a page needs more than ~300 lines, split it.
- **Performance question**: Measure before optimizing. Use `pnpm build && pnpm size-limit` and Playwright traces.
- **Security question**: Default to the stricter option. Ask for explicit confirmation before relaxing.

---

### 9. Definition of done

A change is done when **all** of the following are true:

- [ ] `pnpm agent:check` passes with zero errors.
- [ ] New or changed behavior has tests.
- [ ] Performance budgets still pass.
- [ ] No new `any`, no new `@ts-expect-error` without a reason, no new `eslint-disable` without a reason.
- [ ] No new dependencies unless necessary and justified in the commit message.
- [ ] No secrets, no commented-out code, no `console.log` debug statements.
- [ ] Commit message follows Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`).

If you cannot satisfy all of these, stop and surface the blocker rather than lowering the bar.
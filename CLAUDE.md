# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

A SaaS starter kit built with Next.js 15 (App Router), React 19, Supabase (auth + storage), Drizzle ORM, tRPC, and shadcn/ui.

## Architecture

### API Layer: tRPC

All data operations go through tRPC procedures defined in `server/routers/`.

- **Server components** use `trpc` from `lib/trpc/server.ts` for direct data access: `await trpc.feature.method()`.
- **Client components** use `trpc` hooks exported from `lib/trpc/client.tsx`.
- The tRPC API is mounted at `app/api/trpc/[trpc]/route.ts`.
- All procedures use `superjson` as the transformer (handles Date serialization from Drizzle).

### Adding a New Feature (tRPC pattern)

1. Add procedures to an existing router in `server/routers/` or create a new sub-router.
2. Register the sub-router in `server/routers/index.ts`.
3. In server components: `const data = await trpc.feature.method()` for direct access.
4. In client components: `trpc.feature.method.useQuery()` or `.useMutation()`.
5. After mutations, call `utils.feature.method.invalidate()` to refresh the cache.

### Authentication

- Auth is handled by Supabase. Session cookies managed via `@supabase/ssr`.
- `middleware.ts` refreshes the session on every request via `lib/supabase/proxy.ts`.
- The `app/(app)/` route group requires authentication. Its `layout.tsx` redirects unauthenticated users to `/auth/login`.
- tRPC procedures that require auth use `protectedProcedure` from `server/trpc.ts`.
- `actions/login.ts` syncs a Supabase auth user to the `users` DB table on first login. Keep it as a server action.

### Database

- Schema defined in `db/schema.ts` using Drizzle ORM.
- Run `npx drizzle-kit push` after schema changes to sync to Supabase Postgres.

### File Storage

- Images upload directly from the browser to Supabase Storage via `lib/supabase/storage.ts`.
- Image paths (not URLs) are stored in the database. Signed URLs are generated server-side in the `todos.list` procedure.

### Stripe Subscriptions (optional)

Stripe integration is built-in but **optional** — the app works without `STRIPE_SECRET_KEY` set. Only use or reference this system when the user explicitly asks for subscription/billing functionality.

- **Stripe client**: `lib/stripe.ts` exports `getStripe()` which lazily initializes the Stripe SDK. It throws only when called without the env var, not at import time.
- **tRPC stripe router**: `server/routers/stripe.ts` has three `protectedProcedure`s:
  - `stripe.getSubscriptionStatus` — checks Stripe API directly (no local cache). Returns `{ isActive: boolean, isConfigured: boolean }`. When `STRIPE_SECRET_KEY` is missing, returns `{ isActive: false, isConfigured: false }`.
  - `stripe.createCheckoutSession` — creates/reuses a Stripe customer, returns `{ url }` for Stripe Checkout. Derives the app URL from request headers (no extra env var).
  - `stripe.createPortalSession` — returns `{ url }` for the Stripe billing portal.
- **`RequiresSubscription` wrapper**: `components/requires-subscription.tsx` wraps any UI element. Accepts a `message` prop. When the user has no active subscription, it intercepts clicks (via capture phase) and shows an upgrade dialog. When Stripe is not configured, it renders children directly (no gating).
- **Env vars**: `STRIPE_SECRET_KEY` and `STRIPE_PRICE_ID` (see `.env.example`). Both optional for development.
- The `users` table has a nullable `stripeCustomerId` column used to link users to Stripe customers.

#### Gating a feature behind a subscription

Wrap the interactive element with `RequiresSubscription`:

```tsx
<RequiresSubscription message="Upgrade to Pro to use this feature.">
  <Button onClick={doSomething}>Feature</Button>
</RequiresSubscription>
```

#### Checking subscription status in a component

```tsx
const { data } = trpc.stripe.getSubscriptionStatus.useQuery();
const isActive = data?.isActive ?? false;
```

## Key File Locations

| Purpose                            | Path                               |
| ---------------------------------- | ---------------------------------- |
| tRPC todos router                  | `server/routers/todos.ts`          |
| tRPC stripe router                 | `server/routers/stripe.ts`         |
| tRPC root router                   | `server/routers/index.ts`          |
| tRPC procedure builder             | `server/trpc.ts`                   |
| tRPC context                       | `server/context.ts`                |
| Server-side caller                 | `lib/trpc/server.ts`               |
| Client provider + hooks            | `lib/trpc/client.tsx`              |
| Query client factory               | `lib/trpc/query-client.ts`         |
| tRPC API route                     | `app/api/trpc/[trpc]/route.ts`     |
| Auth layout (route group)          | `app/(app)/layout.tsx`             |
| Todos page                         | `app/(app)/todos/page.tsx`         |
| DB schema                          | `db/schema.ts`                     |
| Stripe client                      | `lib/stripe.ts`                    |
| Subscription gate component        | `components/requires-subscription.tsx` |

## Rules

- Do not use `"use server"` / server actions for data fetching or mutations (except `actions/login.ts`).
- Do not add `revalidatePath()` in tRPC procedures. Use `utils.[router].[procedure].invalidate()` on the client instead.
- Always use `protectedProcedure` for any procedure that touches user data.
- Never expose `db` or the Supabase service-role client to client components.
- Image uploads go directly to Supabase Storage from the browser — not through tRPC.
- Zod input schemas live inline in the router file, not in separate files.
- Protected pages go in `app/(app)/`. The group layout handles auth redirects automatically.
- Do not use `useSuspenseQuery`, `prefetch()`, or `HydrateClient`. Use `useQuery` in client components for all data fetching — it handles loading states on the client without requiring server-side prefetch boilerplate.
- Do not add Stripe subscription gating or billing features unless the user explicitly asks for it. The subscription system is opt-in.

# CarsInMyCity

A full-stack hyper-local car marketplace where buyers find the perfect car nearby and sellers reach motivated buyers in their community. Part of the "In My City" brand family (careinmycity.com, petsinmycity.com).

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port assigned by workflow)
- `pnpm --filter @workspace/cars-in-my-city run dev` — run the frontend (port assigned by workflow)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS v4, wouter routing, framer-motion, shadcn/ui
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (zod/v4), drizzle-zod
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- **DB schema**: `lib/db/src/schema/` — users, cars, car_makes, car_models, seller_profiles, buyer_profiles, favorites, inquiries
- **API contract**: `lib/api-spec/openapi.yaml` — single source of truth, 40+ endpoints
- **Generated hooks**: `lib/api-client-react/src/generated/api.ts`
- **Generated Zod schemas**: `lib/api-zod/src/generated/api.ts`
- **API routes**: `artifacts/api-server/src/routes/` — cars, users, sellers, buyers, favorites, inquiries, makes, stats, search
- **Frontend pages**: `artifacts/cars-in-my-city/src/pages/`
- **Theme**: `artifacts/cars-in-my-city/src/index.css` — deep teal primary (#186 70% 30%), amber accent (#38 92% 50%), Plus Jakarta Sans font

## Architecture decisions

- Contract-first OpenAPI — spec gates codegen which gates frontend; never write raw fetch calls
- Session auth is simplified (demo returns first user); real auth should use Clerk or JWT sessions
- Car `price`, `deliveryFee`, `latitude`, `longitude` stored as Postgres `numeric` → must cast to/from `String()` in route handlers
- `features` and `photos` stored as `jsonb` arrays in Postgres; cast as `string[]` when reading
- Seller identity uses `sellerId` referencing `users.id`, not `seller_profiles.id`

## Product

- **Buyers**: Search by make/model/year/price/mileage/location, browse interactive US map, save favorites, send inquiries, set dream car preferences
- **Sellers**: Create listings with 30+ spec fields, manage inventory, receive inquiries, set delivery options
- **Dealers**: Full seller profile with business name, logo, rating, and multi-listing dashboard
- **Content**: Blog (10 SEO articles), Buyer's Guide, Seller's Guide, About, Terms, Privacy, Affiliates

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always run `pnpm --filter @workspace/api-spec run codegen` after changing `openapi.yaml`
- Google Fonts `@import url(...)` must be the VERY FIRST line in `index.css` — before `@import "tailwindcss"`
- Express 5 wildcard routes: use `/{*splat}` not `*`
- Numeric DB columns (price, fees) come back as strings from pg driver — always `parseFloat()`
- `req.params.id` is `string | string[]` in Express 5 — always parse with `Array.isArray` guard

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details

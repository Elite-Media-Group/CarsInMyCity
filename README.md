# CarsInMyCity

A full-stack hyper-local car marketplace where buyers find the perfect car nearby and sellers reach motivated buyers in their community. Part of the "In My City" brand family (careinmycity.com, petsinmycity.com).

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- **Frontend**: React + Vite + Tailwind CSS v4, wouter routing, framer-motion, shadcn/ui
- **API**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (zod/v4), drizzle-zod
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Project structure

```text
artifacts/
  cars-in-my-city/   # React + Vite frontend
  api-server/        # Express API
lib/
  db/                # Drizzle schema + migrations
  api-spec/          # OpenAPI contract (single source of truth)
  api-client-react/  # Generated React Query hooks
  api-zod/           # Generated Zod schemas
scripts/             # Shared utility scripts
```

## Getting started

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Set the required environment variable:
   - `DATABASE_URL` — Postgres connection string
3. Push the database schema:
   ```bash
   pnpm --filter @workspace/db run push
   ```
4. Run the API server and frontend (in separate terminals):
   ```bash
   pnpm --filter @workspace/api-server run dev
   pnpm --filter @workspace/cars-in-my-city run dev
   ```

## Common commands

| Command | Purpose |
|---|---|
| `pnpm run typecheck` | Full typecheck across all packages |
| `pnpm run build` | Typecheck + build all packages |
| `pnpm --filter @workspace/api-spec run codegen` | Regenerate API hooks and Zod schemas from the OpenAPI spec |
| `pnpm --filter @workspace/db run push` | Push DB schema changes (dev only) |

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
- Session auth is currently simplified for demo purposes; real auth should use Clerk or JWT sessions
- Car `price`, `deliveryFee`, `latitude`, `longitude` are stored as Postgres `numeric` and must be cast to/from `String()` in route handlers
- `features` and `photos` are stored as `jsonb` arrays in Postgres and cast as `string[]` when reading
- Seller identity uses `sellerId` referencing `users.id`, not `seller_profiles.id`

## Product

- **Buyers**: Search by make/model/year/price/mileage/location, browse an interactive US map, save favorites, send inquiries, set dream car preferences
- **Sellers**: Create listings with 30+ spec fields, manage inventory, receive inquiries, set delivery options
- **Dealers**: Full seller profile with business name, logo, rating, and a multi-listing dashboard
- **Content**: Blog (SEO articles), Buyer's Guide (including insurance guides), Seller's Guide, About, Terms, Privacy, Affiliates

## License

MIT

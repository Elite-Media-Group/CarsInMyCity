-- Stabilization migration: indexes + favorites uniqueness
--
-- HOW TO APPLY
--   This project historically used `drizzle-kit push` (schema-first, no
--   migration files). You can either:
--     a) run `pnpm --filter @workspace/db exec drizzle-kit push`, which will
--        diff the updated schema and create these objects, OR
--     b) apply this SQL directly against the database.
--
-- All index statements use IF NOT EXISTS and are safe to run repeatedly.
-- No foreign keys are added here on purpose: the existing seed data may contain
-- rows whose referenced ids do not exist, and adding FKs could fail or delete
-- data. Add FKs in a later migration only after auditing/cleaning the data.

-- ---------------------------------------------------------------------------
-- cars: filtering / sorting indexes
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS "cars_make_idx"   ON "cars" ("make");
CREATE INDEX IF NOT EXISTS "cars_model_idx"  ON "cars" ("model");
CREATE INDEX IF NOT EXISTS "cars_state_idx"  ON "cars" ("state");
CREATE INDEX IF NOT EXISTS "cars_city_idx"   ON "cars" ("city");
CREATE INDEX IF NOT EXISTS "cars_price_idx"  ON "cars" ("price");
CREATE INDEX IF NOT EXISTS "cars_status_idx" ON "cars" ("status");

-- ---------------------------------------------------------------------------
-- inquiries: lookup indexes
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS "inquiries_buyer_idx"  ON "inquiries" ("buyer_id");
CREATE INDEX IF NOT EXISTS "inquiries_seller_idx" ON "inquiries" ("seller_id");
CREATE INDEX IF NOT EXISTS "inquiries_car_idx"    ON "inquiries" ("car_id");

-- ---------------------------------------------------------------------------
-- favorites: lookup index + uniqueness on (user_id, car_id)
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS "favorites_user_idx" ON "favorites" ("user_id");

-- IMPORTANT: the unique index below will FAIL if duplicate (user_id, car_id)
-- rows already exist. De-duplicate first by uncommenting and running this
-- cleanup, which keeps the lowest id per (user_id, car_id) pair:
--
--   DELETE FROM "favorites" a
--   USING "favorites" b
--   WHERE a.id > b.id
--     AND a.user_id = b.user_id
--     AND a.car_id  = b.car_id;
--
CREATE UNIQUE INDEX IF NOT EXISTS "favorites_user_car_unique"
  ON "favorites" ("user_id", "car_id");

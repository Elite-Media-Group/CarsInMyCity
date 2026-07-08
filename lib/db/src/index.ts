import { drizzle } from "drizzle-orm/node-postgres";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

let _pool: pg.Pool | undefined;
let _db: NodePgDatabase<typeof schema> | undefined;

function init(): NodePgDatabase<typeof schema> {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?",
    );
  }
  if (!_pool || !_db) {
    _pool = new Pool({ connectionString: process.env.DATABASE_URL });
    _db = drizzle(_pool, { schema });
  }
  return _db;
}

export function getPool(): pg.Pool {
  init();
  return _pool as pg.Pool;
}

// Lazy proxy: the underlying connection is only created on the first actual
// query, so importing this module (e.g. for /api/health) never throws when
// DATABASE_URL is missing.
export const db = new Proxy({} as NodePgDatabase<typeof schema>, {
  get(_target, prop) {
    const real = init() as unknown as Record<string | symbol, unknown>;
    const value = real[prop];
    return typeof value === "function" ? (value as Function).bind(real) : value;
  },
});

export * from "./schema";

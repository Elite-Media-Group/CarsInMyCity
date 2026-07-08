import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";
import { isDbConfigured, getPool } from "@workspace/db";

const router: IRouter = Router();

/**
 * Liveness probe. Never touches the database, so it always succeeds as long
 * as the process is up. Preserves the existing HealthCheckResponse contract.
 */
router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});

/**
 * Health/readiness endpoint. Reports whether the DB is configured and
 * reachable, but NEVER throws — a missing or unreachable database returns
 * db:false with HTTP 200 instead of crashing the function.
 */
router.get("/health", async (_req, res) => {
  let db = false;
  if (isDbConfigured()) {
    try {
      await getPool().query("SELECT 1");
      db = true;
    } catch {
      db = false;
    }
  }
  res.json({ status: "ok", db });
});

export default router;

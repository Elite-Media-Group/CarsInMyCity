import { Router, type IRouter, type Request, type Response } from "express";
import { logger } from "../lib/logger";
import {
  emitLoopEvent,
  isLoopConfigured,
  isLoopEventName,
} from "../lib/loop";
import type { LoopEventInput } from "../lib/loop";

const router: IRouter = Router();

/**
 * Coerce an unknown value to a trimmed, length-capped string or null.
 * Keeps webhook payloads sane and avoids forwarding huge/hostile blobs.
 */
function str(value: unknown, max = 512): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * POST /api/events
 *
 * Accepts a client-originated analytics/behavior event and forwards it to EMG
 * Loop as a signed webhook. Loop is the source of truth for user behavior,
 * leads, favorites and inquiries. This endpoint:
 *   - never requires a database connection
 *   - never exposes LOOP_WEBHOOK_SECRET to the browser (signing is server-side)
 *   - fails soft: returns 202 even when Loop is unconfigured, so the client UX
 *     is never blocked on telemetry.
 */
router.post("/events", async (req: Request, res: Response) => {
  const body = isPlainObject(req.body) ? req.body : {};

  const eventName = body.event_name;
  if (!isLoopEventName(eventName)) {
    return res.status(400).json({
      error: "invalid_event_name",
      message: "event_name must be a known Loop event.",
    });
  }

  const payload = isPlainObject(body.payload) ? body.payload : {};

  // Derive referrer from the request when the client omits it, but prefer
  // client-supplied values (the SPA knows its own route).
  const headerReferer = str(req.get("referer") ?? req.get("referrer"));

  const input: LoopEventInput = {
    event_name: eventName,
    occurred_at: str(body.occurred_at, 40) ?? new Date().toISOString(),
    anonymous_id: str(body.anonymous_id, 128),
    clerk_user_id: str(body.clerk_user_id, 128),
    session_id: str(body.session_id, 128),
    page_url: str(body.page_url, 2048),
    referrer: str(body.referrer, 2048) ?? headerReferer,
    payload,
  };

  const result = await emitLoopEvent(input);

  if (result.status === "error") {
    logger.warn(
      { eventName, reason: result.reason },
      "Loop event accepted but delivery failed",
    );
  }

  return res.status(202).json({
    accepted: true,
    delivery: result.status,
    loop_configured: isLoopConfigured(),
  });
});

/**
 * GET /api/events/health
 * Lightweight readiness probe for the Loop integration. Does not reveal the
 * secret or URL, only whether delivery is configured.
 */
router.get("/events/health", (_req: Request, res: Response) => {
  return res.status(200).json({
    integration: "loop",
    configured: isLoopConfigured(),
  });
});

export default router;

import type { Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger";

const isProduction = process.env.NODE_ENV === "production";

/**
 * A well-known application error whose message is safe to expose to clients.
 * Throw (or next()) one of these when you want a specific status + message.
 */
export class HttpError extends Error {
  status: number;
  expose: boolean;
  constructor(status: number, message: string, expose = true) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.expose = expose;
  }
}

/** 404 handler for unmatched API routes. */
export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ error: "Not found" });
}

/**
 * Centralized error handler.
 *
 * - Always logs the full error (stack included) server-side via pino.
 * - In production, only sends a generic message to the client unless the error
 *   is an explicitly client-safe HttpError. Never leaks stack traces.
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const httpErr = err instanceof HttpError ? err : null;
  const status = httpErr?.status ?? 500;

  // Full detail is logged server-side only.
  const log = (req as Request & { log?: typeof logger }).log ?? logger;
  log.error(
    { err, status, method: req.method, url: req.url?.split("?")[0] },
    "request_error",
  );

  if (res.headersSent) {
    return;
  }

  // Decide what the client is allowed to see.
  const safeMessage =
    httpErr && httpErr.expose
      ? httpErr.message
      : status < 500
        ? httpErr?.message ?? "Bad request"
        : "Internal server error";

  const body: Record<string, unknown> = { error: safeMessage };

  // Only in non-production do we include debug detail.
  if (!isProduction && !httpErr) {
    body.detail = err instanceof Error ? err.message : String(err);
  }

  res.status(status).json(body);
}

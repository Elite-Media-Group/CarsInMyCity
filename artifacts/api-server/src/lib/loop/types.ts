// Loop webhook event types and payload contracts.
//
// CarsInMyCity emits structured events to EMG Loop, which is the source of
// truth for leads, inquiries, favorites, search behavior and user profiles.
// This module defines the wire contract only; see ./client for transport.

export const LOOP_EVENT_NAMES = [
  "car_search_performed",
  "car_viewed",
  "lead_submitted",
  "inquiry_submitted",
  "favorite_added",
  "favorite_removed",
  "seller_signup_started",
] as const;

export type LoopEventName = (typeof LOOP_EVENT_NAMES)[number];

export function isLoopEventName(value: unknown): value is LoopEventName {
  return (
    typeof value === "string" &&
    (LOOP_EVENT_NAMES as readonly string[]).includes(value)
  );
}

export type LoopEnvironment = "production" | "preview" | "development";

/**
 * Identity / context fields that accompany every event. All optional except
 * what the caller can provide; Loop resolves/merges profiles server-side.
 */
export interface LoopEventContext {
  anonymous_id?: string | null;
  clerk_user_id?: string | null;
  session_id?: string | null;
  page_url?: string | null;
  referrer?: string | null;
}

/**
 * The canonical envelope sent to Loop. `payload` carries the event-specific
 * body (e.g. search filters, listing snapshot).
 */
export interface LoopEvent extends LoopEventContext {
  event_id: string;
  event_name: LoopEventName;
  occurred_at: string;
  source: "carsinmycity";
  site_url: string;
  environment: LoopEnvironment;
  payload: Record<string, unknown>;
}

/**
 * Input accepted from callers (routes). Server fills in the rest
 * (event_id, occurred_at, source, site_url, environment).
 */
export interface LoopEventInput extends LoopEventContext {
  event_name: LoopEventName;
  occurred_at?: string;
  payload?: Record<string, unknown>;
}

export interface LoopDeliveryResult {
  /** True when the event was accepted (2xx) or safely skipped (not configured). */
  ok: boolean;
  /** "sent" when delivered, "skipped" when Loop is not configured, "error" on failure. */
  status: "sent" | "skipped" | "error";
  /** HTTP status code when a request was actually made. */
  httpStatus?: number;
  /** Non-sensitive reason string for logging/telemetry. Never includes the secret. */
  reason?: string;
}

export interface LoopClientConfig {
  webhookUrl: string | undefined;
  webhookSecret: string | undefined;
  siteUrl: string;
  environment: LoopEnvironment;
  /** Request timeout in milliseconds. */
  timeoutMs?: number;
}

// Client-side Loop event helper.
//
// Sends structured behavior events to our own server endpoint (/api/events),
// which signs and forwards them to EMG Loop. The webhook secret NEVER lives in
// the browser. All calls are best-effort and must never block or break the UI.

import { LOOP_EVENTS } from "./loop-event-names";

const ANON_KEY = "cimc_anonymous_id";
const SESSION_KEY = "cimc_session_id";
const ENDPOINT = "/api/events";

function safeUUID(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    // fall through
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (ch) => {
    const r = (Math.random() * 16) | 0;
    const v = ch === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getAnonymousId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = window.localStorage.getItem(ANON_KEY);
    if (!id) {
      id = safeUUID();
      window.localStorage.setItem(ANON_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = window.sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = safeUUID();
      window.sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

export type LoopEventName = (typeof LOOP_EVENTS)[keyof typeof LOOP_EVENTS];

export interface TrackOptions {
  /** Clerk user id when the visitor is authenticated. */
  clerkUserId?: string | null;
}

/**
 * Fire-and-forget event tracking. Resolves to true if the request was sent
 * (regardless of Loop delivery outcome) and false if it could not be sent.
 */
export async function trackLoopEvent(
  eventName: LoopEventName,
  payload: Record<string, unknown> = {},
  options: TrackOptions = {},
): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const bodyObject = {
    event_name: eventName,
    occurred_at: new Date().toISOString(),
    anonymous_id: getAnonymousId(),
    session_id: getSessionId(),
    clerk_user_id: options.clerkUserId ?? null,
    page_url: window.location.href,
    referrer: document.referrer || null,
    payload,
  };

  try {
    if (
      eventName === LOOP_EVENTS.CAR_VIEWED &&
      typeof navigator !== "undefined" &&
      typeof navigator.sendBeacon === "function"
    ) {
      const blob = new Blob([JSON.stringify(bodyObject)], {
        type: "application/json",
      });
      const ok = navigator.sendBeacon(ENDPOINT, blob);
      if (ok) return true;
    }

    await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyObject),
      keepalive: true,
    });
    return true;
  } catch {
    // Telemetry must never break the app.
    return false;
  }
}

// Lazy singleton accessor for the Loop webhook client.
//
// Reads configuration from the environment. Loop is optional: when the
// webhook URL/secret are absent the client is still constructed but reports
// isConfigured() === false and skips delivery, so the site degrades
// gracefully to local data.

import { LoopWebhookClient } from "./client";
import type { LoopEnvironment, LoopEventInput, LoopDeliveryResult } from "./types";

let cached: LoopWebhookClient | null = null;

function resolveEnvironment(): LoopEnvironment {
  const ctx = process.env.CONTEXT; // Netlify: production | deploy-preview | branch-deploy
  if (ctx === "production") return "production";
  if (ctx === "deploy-preview" || ctx === "branch-deploy") return "preview";
  const nodeEnv = process.env.NODE_ENV;
  if (nodeEnv === "production") return "production";
  return "development";
}

function resolveSiteUrl(): string {
  return (
    process.env.LOOP_SITE_URL ||
    process.env.URL ||
    process.env.DEPLOY_PRIME_URL ||
    "https://carsinmycity.com"
  );
}

export function getLoopClient(): LoopWebhookClient {
  if (cached) return cached;
  cached = new LoopWebhookClient({
    webhookUrl: process.env.LOOP_WEBHOOK_URL,
    webhookSecret: process.env.LOOP_WEBHOOK_SECRET,
    siteUrl: resolveSiteUrl(),
    environment: resolveEnvironment(),
  });
  return cached;
}

/** For tests: override the singleton with a custom client. */
export function setLoopClient(client: LoopWebhookClient | null): void {
  cached = client;
}

/** True when Loop delivery is configured for this environment. */
export function isLoopConfigured(): boolean {
  return getLoopClient().isConfigured();
}

/**
 * Best-effort emit. Never throws; returns a delivery result. Safe to call
 * from request handlers without awaiting if fire-and-forget is desired,
 * though awaiting is recommended so failures can be recorded.
 */
export async function emitLoopEvent(
  input: LoopEventInput,
): Promise<LoopDeliveryResult> {
  try {
    return await getLoopClient().send(input);
  } catch {
    return { ok: false, status: "error", reason: "unexpected_error" };
  }
}

export { LoopWebhookClient } from "./client";
export { signLoopBody } from "./client";
export * from "./types";

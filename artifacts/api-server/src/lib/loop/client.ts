import { createHmac, randomUUID } from "node:crypto";
import { logger } from "../logger";
import type {
  LoopClientConfig,
  LoopDeliveryResult,
  LoopEvent,
  LoopEventInput,
} from "./types";

const DEFAULT_TIMEOUT_MS = 8000;
const SIGNATURE_HEADER = "X-Loop-Signature";

/**
 * Compute the webhook signature for a raw JSON body.
 * Format: "sha256=<hex_digest>" (HMAC-SHA256 over the exact bytes sent).
 * The secret is never logged or returned.
 */
export function signLoopBody(rawBody: string, secret: string): string {
  const digest = createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
  return `sha256=${digest}`;
}

/**
 * Transport client for EMG Loop. Designed to fail safe: when Loop is not
 * configured (missing URL or secret) events are skipped with ok:true so that
 * CarsInMyCity keeps working with local data as fallback. Delivery failures
 * never throw into request handlers.
 */
export class LoopWebhookClient {
  private readonly config: LoopClientConfig;

  constructor(config: LoopClientConfig) {
    this.config = config;
  }

  /** True when both the URL and secret are present. */
  isConfigured(): boolean {
    return Boolean(this.config.webhookUrl) && Boolean(this.config.webhookSecret);
  }

  /**
   * Build the canonical, fully-populated event envelope from caller input.
   */
  buildEvent(input: LoopEventInput): LoopEvent {
    return {
      event_id: randomUUID(),
      event_name: input.event_name,
      occurred_at: input.occurred_at ?? new Date().toISOString(),
      source: "carsinmycity",
      site_url: this.config.siteUrl,
      environment: this.config.environment,
      anonymous_id: input.anonymous_id ?? null,
      clerk_user_id: input.clerk_user_id ?? null,
      session_id: input.session_id ?? null,
      page_url: input.page_url ?? null,
      referrer: input.referrer ?? null,
      payload: input.payload ?? {},
    };
  }

  /**
   * Deliver an event to Loop. Returns a result object rather than throwing so
   * callers can treat delivery as best-effort telemetry.
   */
  async send(input: LoopEventInput): Promise<LoopDeliveryResult> {
    if (!this.isConfigured()) {
      return {
        ok: true,
        status: "skipped",
        reason: "loop_not_configured",
      };
    }

    const event = this.buildEvent(input);
    const rawBody = JSON.stringify(event);
    const signature = signLoopBody(rawBody, this.config.webhookSecret as string);

    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      this.config.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    );

    try {
      const response = await fetch(this.config.webhookUrl as string, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          [SIGNATURE_HEADER]: signature,
        },
        body: rawBody,
        signal: controller.signal,
      });

      if (!response.ok) {
        logger.warn(
          { eventName: event.event_name, httpStatus: response.status },
          "Loop webhook delivery returned non-2xx",
        );
        return {
          ok: false,
          status: "error",
          httpStatus: response.status,
          reason: "non_2xx_response",
        };
      }

      return { ok: true, status: "sent", httpStatus: response.status };
    } catch (error) {
      const reason =
        error instanceof Error && error.name === "AbortError"
          ? "timeout"
          : "network_error";
      logger.warn(
        { eventName: event.event_name, reason },
        "Loop webhook delivery failed",
      );
      return { ok: false, status: "error", reason };
    } finally {
      clearTimeout(timeout);
    }
  }
}

# Loop Webhook Integration & Database Decoupling

CarsInMyCity is a **thin front door** for nationwide vehicle search. It queries
MarketCheck server-side, renders search / results / detail pages, and forwards
structured user-behavior events to **EMG Loop** over signed webhooks. Loop is the
**source of truth** for leads, inquiries, favorites, search behavior, listing
views and user profiles.

## Data ownership

| Concern | Owner |
| --- | --- |
| Nationwide vehicle inventory | MarketCheck (queried server-side) |
| Leads, inquiries, favorites, search behavior, user profiles | **EMG Loop (Neon)** |
| Local demo/seed cars | CarsInMyCity DB (optional fallback only) |

The local Postgres database is **optional**. There is no hard `DATABASE_URL`
requirement: the API boots without it and treats any local cars purely as
seed/fallback listings, never as the system of record. Legacy `/favorites` and
`/inquiries` routes remain in place as a temporary fallback and will be migrated
to emit Loop events over time.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `MARKETCHECK_API_KEY` | for live search | Server-side MarketCheck access |
| `LOOP_WEBHOOK_URL` | for event delivery | Loop webhook receiver endpoint |
| `LOOP_WEBHOOK_SECRET` | for event delivery | HMAC-SHA256 signing secret |
| `LOOP_SITE_URL` | optional | Overrides the reported site_url |

If `LOOP_WEBHOOK_URL` or `LOOP_WEBHOOK_SECRET` is missing, event delivery is
**skipped gracefully** (no errors, UI unaffected).

## Webhook contract

- Transport: HTTPS `POST` to `LOOP_WEBHOOK_URL`
- Body: JSON envelope (below)
- Signature header: `X-Loop-Signature: sha256=<hex_digest>`
  where the digest is HMAC-SHA256 of the **raw JSON body** using
  `LOOP_WEBHOOK_SECRET`.

### Envelope

```json
{
  "event_id": "uuid",
  "event_name": "car_search_performed",
  "occurred_at": "ISO timestamp",
  "source": "carsinmycity",
  "site_url": "https://carsinmycity.com",
  "environment": "production|preview|development",
  "anonymous_id": "...",
  "clerk_user_id": "...",
  "session_id": "...",
  "page_url": "...",
  "referrer": "...",
  "payload": {}
}
```

### Event names

- `car_search_performed`
- `car_viewed`
- `lead_submitted`
- `inquiry_submitted`
- `favorite_added`
- `favorite_removed`
- `seller_signup_started`

## Flow

1. Browser calls `POST /api/events` with an event name + payload
   (no secret in the browser).
2. The server enriches the event, signs the raw body with
   `LOOP_WEBHOOK_SECRET`, and forwards it to `LOOP_WEBHOOK_URL`.
3. Loop verifies the signature, persists the event to Neon, and builds
   profiles / automation triggers.

## Security

- The webhook secret is **server-side only** and is never sent to the browser
  or logged.
- Signing uses HMAC-SHA256 over the exact bytes transmitted.
- Loop must verify `X-Loop-Signature` before trusting any event.

// Canonical Loop event names for the browser. Must stay in sync with the
// server-side LOOP_EVENT_NAMES in api-server/src/lib/loop/types.ts.

export const LOOP_EVENTS = {
  CAR_SEARCH_PERFORMED: "car_search_performed",
  CAR_VIEWED: "car_viewed",
  LEAD_SUBMITTED: "lead_submitted",
  INQUIRY_SUBMITTED: "inquiry_submitted",
  FAVORITE_ADDED: "favorite_added",
  FAVORITE_REMOVED: "favorite_removed",
  SELLER_SIGNUP_STARTED: "seller_signup_started",
} as const;

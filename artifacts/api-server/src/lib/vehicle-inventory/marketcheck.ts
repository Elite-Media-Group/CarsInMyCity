import { logger } from "../logger";
import type {
  NormalizedCar,
  VehicleInventoryProvider,
  VehicleSearchParams,
  VehicleSearchResult,
} from "./types";

/**
 * MarketCheck Inventory Search provider.
 *
 * Wraps the MarketCheck "active" car search endpoint and normalizes results
 * into the internal car-card shape. Runs server-side only; the API key is
 * read from the MARKETCHECK_API_KEY environment variable and is never sent
 * to the browser.
 *
 * Docs: https://docs.marketcheck.com/docs/api/cars/inventory/inventory-search
 * Endpoint: GET https://api.marketcheck.com/v2/search/car/active
 */

const MARKETCHECK_BASE_URL = "https://api.marketcheck.com/v2";
const SEARCH_PATH = "/search/car/active";

/** Max rows per request supported by MarketCheck. */
const MAX_ROWS = 50;
/** Radius above which MarketCheck warns about slower responses. */
const MAX_SAFE_RADIUS = 100;
/** Abort the upstream request if it takes longer than this. */
const REQUEST_TIMEOUT_MS = 10_000;

/** Shape of the subset of the MarketCheck response we rely on. */
interface McBuild {
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  body_type?: string;
  fuel_type?: string;
  transmission?: string;
  drivetrain?: string;
  engine?: string;
  city_mpg?: number;
  highway_mpg?: number;
}

interface McDealer {
  name?: string;
  city?: string;
  state?: string;
  zip?: string;
}

interface McMedia {
  photo_links?: string[];
  photo_links_cached?: string[];
}

interface McListing {
  id?: string;
  vin?: string;
  price?: number;
  miles?: number;
  exterior_color?: string;
  vdp_url?: string;
  dist?: number;
  media?: McMedia;
  dealer?: McDealer;
  build?: McBuild;
}

interface McResponse {
  num_found?: number;
  listings?: McListing[];
}

/** Convert a MarketCheck listing into the internal normalized car shape. */
export function normalizeMarketCheckListing(listing: McListing): NormalizedCar {
  const build = listing.build ?? {};
  const dealer = listing.dealer ?? {};
  const media = listing.media ?? {};

  const photos = [
    ...(media.photo_links ?? []),
    ...(media.photo_links_cached ?? []),
  ].filter((url): url is string => typeof url === "string" && url.length > 0);

  const id = listing.id ?? listing.vin ?? cryptoRandomId();

  return {
    id: String(id),
    source: "marketcheck",
    vin: listing.vin,
    year: build.year,
    make: build.make,
    model: build.model,
    trim: build.trim,
    price: typeof listing.price === "number" ? listing.price : undefined,
    mileage: typeof listing.miles === "number" ? listing.miles : undefined,
    bodyStyle: build.body_type,
    fuelType: build.fuel_type,
    transmission: build.transmission,
    drivetrain: build.drivetrain,
    exteriorColor: listing.exterior_color,
    engineSize: build.engine,
    mpgCity: build.city_mpg,
    mpgHighway: build.highway_mpg,
    photos,
    city: dealer.city,
    state: dealer.state,
    zipCode: dealer.zip,
    dealerName: dealer.name,
    distance: typeof listing.dist === "number" ? listing.dist : undefined,
    listingUrl: listing.vdp_url,
    sellerType: "dealer",
  };
}

/** Small fallback id generator for listings missing both id and VIN. */
function cryptoRandomId(): string {
  return "mc_" + Math.random().toString(36).slice(2, 12);
}

/**
 * Map the normalized {@link VehicleSearchParams} to MarketCheck query params.
 * Only defined values are included so we never send empty filters.
 */
export function buildMarketCheckQuery(
  params: VehicleSearchParams,
  apiKey: string,
): URLSearchParams {
  const q = new URLSearchParams();
  q.set("api_key", apiKey);
  q.set("country", "us");
  q.set("car_type", params.carType ?? "used");
  q.set("start", String(Math.max(0, params.start ?? 0)));
  q.set("rows", String(Math.min(MAX_ROWS, Math.max(1, params.rows ?? 20))));
  // Only return listings that have at least one photo for a real UX.
  q.set("photo_links", "true");

  if (params.make) q.set("make", params.make);
  if (params.model) q.set("model", params.model);
  if (params.zip) q.set("zip", params.zip);
  if (typeof params.radius === "number") {
    q.set("radius", String(Math.min(MAX_SAFE_RADIUS, Math.max(1, params.radius))));
  }
  if (params.bodyStyle) q.set("body_type", params.bodyStyle);
  if (typeof params.year === "number") q.set("year", String(params.year));

  // Price range: MarketCheck expects "min-max".
  const hasMin = typeof params.minPrice === "number";
  const hasMax = typeof params.maxPrice === "number";
  if (hasMin || hasMax) {
    const min = hasMin ? params.minPrice : 0;
    const max = hasMax ? params.maxPrice : 10_000_000;
    q.set("price_range", min + "-" + max);
  }

  // Mileage range: "min-max" miles. We only take an upper bound.
  if (typeof params.maxMileage === "number") {
    q.set("miles_range", "0-" + params.maxMileage);
  }

  return q;
}

export class MarketCheckProvider implements VehicleInventoryProvider {
  readonly name = "marketcheck";
  private readonly apiKey: string | undefined;

  constructor(apiKey: string | undefined = process.env.MARKETCHECK_API_KEY) {
    this.apiKey = apiKey && apiKey.trim().length > 0 ? apiKey.trim() : undefined;
  }

  isConfigured(): boolean {
    return typeof this.apiKey === "string" && this.apiKey.length > 0;
  }

  async search(params: VehicleSearchParams): Promise<VehicleSearchResult> {
    if (!this.apiKey) {
      throw new Error("MarketCheck provider is not configured (missing API key)");
    }

    const query = buildMarketCheckQuery(params, this.apiKey);
    const url = MARKETCHECK_BASE_URL + SEARCH_PATH + "?" + query.toString();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });
    } catch (err) {
      // Never log the API key. Log the normalized params only.
      logger.error({ err, params }, "MarketCheck request failed");
      throw new Error("Upstream vehicle inventory request failed");
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      logger.error(
        { status: response.status, params },
        "MarketCheck returned a non-2xx status",
      );
      throw new Error("Upstream vehicle inventory returned " + response.status);
    }

    const data = (await response.json()) as McResponse;
    const listings = Array.isArray(data.listings) ? data.listings : [];

    return {
      cars: listings.map(normalizeMarketCheckListing),
      total: typeof data.num_found === "number" ? data.num_found : listings.length,
      source: this.name,
      radius: typeof params.radius === "number" ? params.radius : undefined,
    };
  }
}

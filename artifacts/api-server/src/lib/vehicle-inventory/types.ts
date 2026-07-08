/**
 * Vehicle inventory provider abstraction.
 *
 * Defines a provider-agnostic contract for searching third-party vehicle
 * inventory (e.g. MarketCheck) and a normalized listing shape that matches
 * the internal car-card format used by the web app.
 *
 * IMPORTANT: Providers run server-side only. API keys must never be exposed
 * to the browser.
 */

/** Normalized search request accepted by every provider. */
export interface VehicleSearchParams {
  make?: string;
  model?: string;
  zip?: string;
  /** Search radius in miles. */
  radius?: number;
  minPrice?: number;
  maxPrice?: number;
  /** Single model year, e.g. 2022. */
  year?: number;
  /** Maximum odometer reading in miles. */
  maxMileage?: number;
  /** Body style, e.g. "SUV", "Sedan", "Pickup". */
  bodyStyle?: string;
  /** new | used | certified. Optional; provider decides default. */
  carType?: "new" | "used" | "certified";
  /** Pagination: zero-based offset. */
  start?: number;
  /** Page size. */
  rows?: number;
}

/**
 * Normalized listing shape. Mirrors the fields consumed by the internal
 * CarCard component so provider results can render alongside local cars.
 */
export interface NormalizedCar {
  /** Stable id for the listing (provider id or VIN-derived). */
  id: string;
  source: string;
  vin?: string;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  price?: number;
  mileage?: number;
  bodyStyle?: string;
  fuelType?: string;
  transmission?: string;
  drivetrain?: string;
  exteriorColor?: string;
  engineSize?: string;
  mpgCity?: number;
  mpgHighway?: number;
  photos: string[];
  city?: string;
  state?: string;
  zipCode?: string;
  dealerName?: string;
  /** Distance in miles from the searched location, when available. */
  distance?: number;
  /** Link to the original vehicle detail page. */
  listingUrl?: string;
  /** Always "dealer" for provider inventory; keeps card typing consistent. */
  sellerType: "dealer";
}

export interface VehicleSearchResult {
  cars: NormalizedCar[];
  /** Total matching listings reported by the provider. */
  total: number;
  /** Provider identifier that produced the results. */
  source: string;
  /** Radius (miles) actually used for the search, when applicable. */
  radius?: number;
}

/**
 * A vehicle inventory provider. Implementations wrap a third-party API and
 * normalize results into {@link NormalizedCar}.
 */
export interface VehicleInventoryProvider {
  /** Human-readable provider identifier, e.g. "marketcheck". */
  readonly name: string;
  /** True when the provider has the configuration it needs to run. */
  isConfigured(): boolean;
  /** Execute a normalized search. Should reject on transport/HTTP errors. */
  search(params: VehicleSearchParams): Promise<VehicleSearchResult>;
}

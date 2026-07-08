import { MarketCheckProvider } from "./marketcheck";
import type { VehicleInventoryProvider } from "./types";

export type {
  NormalizedCar,
  VehicleInventoryProvider,
  VehicleSearchParams,
  VehicleSearchResult,
} from "./types";
export { MarketCheckProvider, normalizeMarketCheckListing } from "./marketcheck";

/**
 * Lazily-created singleton provider.
 *
 * The provider is instantiated on first use (not at module import) so that a
 * missing MARKETCHECK_API_KEY never crashes the serverless function at boot.
 * The endpoint decides how to degrade when the provider is unconfigured.
 */
let cachedProvider: VehicleInventoryProvider | null = null;

/**
 * Returns the active vehicle inventory provider.
 *
 * Currently only MarketCheck is supported. Additional providers can be
 * selected here (e.g. via an INVENTORY_PROVIDER env var) without touching the
 * route or the frontend, thanks to the shared {@link VehicleInventoryProvider}
 * contract.
 */
export function getVehicleInventoryProvider(): VehicleInventoryProvider {
  if (!cachedProvider) {
    cachedProvider = new MarketCheckProvider();
  }
  return cachedProvider;
}

/** Test/override hook: replace the cached provider. */
export function setVehicleInventoryProvider(
  provider: VehicleInventoryProvider | null,
): void {
  cachedProvider = provider;
}

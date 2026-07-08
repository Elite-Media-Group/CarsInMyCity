import { Router, type IRouter } from "express";
import { and, desc, eq, gte, ilike, lte } from "drizzle-orm";
import { db, carsTable } from "@workspace/db";
import { logger } from "../lib/logger";
import { getVehicleInventoryProvider } from "../lib/vehicle-inventory";
import type {
  NormalizedCar,
  VehicleSearchParams,
} from "../lib/vehicle-inventory";

const router: IRouter = Router();

const DEFAULT_ROWS = 20;
const MAX_ROWS = 50;
const DEFAULT_RADIUS = 50;

/** Parse a positive number from a query value, or return undefined. */
function num(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

/** Parse a trimmed non-empty string from a query value, or undefined. */
function str(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const s = value.trim();
  return s.length > 0 ? s : undefined;
}

/** Translate the incoming request query into normalized search params. */
function parseSearchParams(query: Record<string, unknown>): VehicleSearchParams {
  const carTypeRaw = str(query.carType);
  const carType =
    carTypeRaw === "new" || carTypeRaw === "used" || carTypeRaw === "certified"
      ? carTypeRaw
      : undefined;

  const rows = Math.min(MAX_ROWS, Math.max(1, num(query.rows) ?? DEFAULT_ROWS));
  const start = Math.max(0, num(query.start) ?? 0);

  return {
    make: str(query.make),
    model: str(query.model),
    zip: str(query.zip),
    radius: num(query.radius) ?? (str(query.zip) ? DEFAULT_RADIUS : undefined),
    minPrice: num(query.minPrice),
    maxPrice: num(query.maxPrice),
    year: num(query.year),
    maxMileage: num(query.maxMileage),
    bodyStyle: str(query.bodyStyle),
    carType,
    rows,
    start,
  };
}

/**
 * Normalize a local DB car row into the shared {@link NormalizedCar} shape so
 * seed/local listings can render alongside provider results.
 */
function normalizeLocalCar(car: typeof carsTable.$inferSelect): NormalizedCar {
  const photos = Array.isArray(car.photos)
    ? (car.photos as unknown[]).filter(
        (p): p is string => typeof p === "string" && p.length > 0,
      )
    : [];

  return {
    id: String(car.id),
    source: "local",
    vin: car.vin ?? undefined,
    year: car.year ?? undefined,
    make: car.make ?? undefined,
    model: car.model ?? undefined,
    trim: car.trim ?? undefined,
    price: car.price != null ? Number(car.price) : undefined,
    mileage: car.mileage ?? undefined,
    bodyStyle: car.bodyStyle ?? undefined,
    fuelType: car.fuelType ?? undefined,
    transmission: car.transmission ?? undefined,
    drivetrain: car.drivetrain ?? undefined,
    exteriorColor: car.exteriorColor ?? undefined,
    engineSize: car.engineSize ?? undefined,
    mpgCity: car.mpgCity ?? undefined,
    mpgHighway: car.mpgHighway ?? undefined,
    photos,
    city: car.city ?? undefined,
    state: car.state ?? undefined,
    zipCode: car.zipCode ?? undefined,
    dealerName: undefined,
    listingUrl: "/cars/" + car.id,
    sellerType: "dealer",
  };
}

/**
 * Fallback to local DB cars. Kept defensive: any DB error is swallowed and an
 * empty list is returned so a database outage never white-screens search.
 */
async function searchLocalCars(
  params: VehicleSearchParams,
): Promise<NormalizedCar[]> {
  try {
    // "active" is the for-sale status in carStatusEnum.
    const filters = [eq(carsTable.status, "active")];
    if (params.make) filters.push(ilike(carsTable.make, params.make));
    if (params.model) filters.push(ilike(carsTable.model, "%" + params.model + "%"));
    if (params.bodyStyle) filters.push(ilike(carsTable.bodyStyle, params.bodyStyle));
    if (params.zip) filters.push(eq(carsTable.zipCode, params.zip));
    if (typeof params.year === "number") filters.push(eq(carsTable.year, params.year));
    if (typeof params.minPrice === "number") {
      filters.push(gte(carsTable.price, String(params.minPrice)));
    }
    if (typeof params.maxPrice === "number") {
      filters.push(lte(carsTable.price, String(params.maxPrice)));
    }
    if (typeof params.maxMileage === "number") {
      filters.push(lte(carsTable.mileage, params.maxMileage));
    }

    const rows = await db
      .select()
      .from(carsTable)
      .where(and(...filters))
      .orderBy(desc(carsTable.createdAt))
      .limit(params.rows ?? DEFAULT_ROWS);

    return rows.map(normalizeLocalCar);
  } catch (err) {
    logger.error({ err }, "Local car fallback query failed");
    return [];
  }
}

/**
 * GET /api/search-cars
 *
 * Nationwide car search backed by a third-party inventory provider
 * (MarketCheck). Falls back to local DB listings when the provider is not
 * configured or the upstream call fails, so the page always has data to show.
 *
 * Query params: make, model, zip, radius, minPrice, maxPrice, year,
 * maxMileage, bodyStyle, carType, rows, start.
 */
router.get("/search-cars", async (req, res): Promise<void> => {
  const params = parseSearchParams(req.query as Record<string, unknown>);
  const provider = getVehicleInventoryProvider();

  // 1. Preferred path: use the configured inventory provider.
  if (provider.isConfigured()) {
    try {
      const result = await provider.search(params);
      res.json({
        cars: result.cars,
        total: result.total,
        source: result.source,
        radius: result.radius ?? params.radius,
        fallback: false,
      });
      return;
    } catch (err) {
      logger.error({ err }, "Inventory provider search failed; falling back");
      const cars = await searchLocalCars(params);
      res.json({
        cars,
        total: cars.length,
        source: "local",
        radius: params.radius,
        fallback: true,
        message:
          "Live inventory is temporarily unavailable; showing local listings.",
      });
      return;
    }
  }

  // 2. Provider not configured: gracefully serve local listings.
  const cars = await searchLocalCars(params);
  res.json({
    cars,
    total: cars.length,
    source: "local",
    radius: params.radius,
    fallback: true,
    message:
      "Nationwide inventory is not configured; showing local listings only.",
  });
});

export default router;

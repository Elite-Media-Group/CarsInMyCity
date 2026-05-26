import { Router, type IRouter } from "express";
import { eq, and, gte, lte, ilike, sql, desc, asc, count } from "drizzle-orm";
import { db, carsTable } from "@workspace/db";
import {
  ListCarsQueryParams,
  CreateCarBody,
  GetCarParams,
  UpdateCarParams,
  UpdateCarBody,
  DeleteCarParams,
  GetFeaturedCarsQueryParams,
  GetRecentCarsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function buildCarFilters(params: {
  make?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  mileageMax?: number;
  condition?: string;
  bodyStyle?: string;
  transmission?: string;
  fuelType?: string;
  color?: string;
  state?: string;
  city?: string;
  zipCode?: string;
  sellerType?: string;
}) {
  const conditions = [eq(carsTable.status, "active")];
  if (params.make) conditions.push(ilike(carsTable.make, `%${params.make}%`));
  if (params.model) conditions.push(ilike(carsTable.model, `%${params.model}%`));
  if (params.yearMin) conditions.push(gte(carsTable.year, params.yearMin));
  if (params.yearMax) conditions.push(lte(carsTable.year, params.yearMax));
  if (params.priceMin) conditions.push(gte(carsTable.price, String(params.priceMin)));
  if (params.priceMax) conditions.push(lte(carsTable.price, String(params.priceMax)));
  if (params.mileageMax) conditions.push(lte(carsTable.mileage, params.mileageMax));
  if (params.condition) conditions.push(eq(carsTable.condition, params.condition as "new" | "used" | "certified"));
  if (params.bodyStyle) conditions.push(ilike(carsTable.bodyStyle, `%${params.bodyStyle}%`));
  if (params.transmission) conditions.push(ilike(carsTable.transmission, `%${params.transmission}%`));
  if (params.fuelType) conditions.push(ilike(carsTable.fuelType, `%${params.fuelType}%`));
  if (params.color) conditions.push(ilike(carsTable.exteriorColor, `%${params.color}%`));
  if (params.state) conditions.push(eq(carsTable.state, params.state));
  if (params.city) conditions.push(ilike(carsTable.city, `%${params.city}%`));
  if (params.zipCode) conditions.push(eq(carsTable.zipCode, params.zipCode));
  if (params.sellerType) conditions.push(eq(carsTable.sellerType, params.sellerType as "dealer" | "private" | "certified_dealer"));
  return conditions;
}

function formatCar(car: typeof carsTable.$inferSelect, favoritedIds: Set<number> = new Set()) {
  return {
    id: car.id,
    title: `${car.year} ${car.make} ${car.model}${car.trim ? " " + car.trim : ""}`,
    make: car.make,
    model: car.model,
    trim: car.trim ?? null,
    year: car.year,
    price: parseFloat(car.price),
    mileage: car.mileage,
    condition: car.condition,
    bodyStyle: car.bodyStyle ?? null,
    transmission: car.transmission ?? null,
    fuelType: car.fuelType ?? null,
    drivetrain: car.drivetrain ?? null,
    engineSize: car.engineSize ?? null,
    exteriorColor: car.exteriorColor ?? null,
    interiorColor: car.interiorColor ?? null,
    interiorType: car.interiorType ?? null,
    mpgCity: car.mpgCity ?? null,
    mpgHighway: car.mpgHighway ?? null,
    vin: car.vin ?? null,
    titleStatus: car.titleStatus ?? null,
    tireSize: car.tireSize ?? null,
    audioSystem: car.audioSystem ?? null,
    features: (car.features as string[]) ?? [],
    photos: (car.photos as string[]) ?? [],
    description: car.description ?? null,
    state: car.state,
    city: car.city,
    zipCode: car.zipCode,
    latitude: car.latitude ? parseFloat(car.latitude) : null,
    longitude: car.longitude ? parseFloat(car.longitude) : null,
    sellerType: car.sellerType,
    sellerId: car.sellerId,
    sellerName: null,
    deliveryAvailable: car.deliveryAvailable ?? false,
    deliveryFee: car.deliveryFee ? parseFloat(car.deliveryFee) : null,
    status: car.status,
    viewCount: car.viewCount ?? 0,
    favoriteCount: car.favoriteCount ?? 0,
    isFavorited: favoritedIds.has(car.id),
    createdAt: car.createdAt.toISOString(),
    updatedAt: car.updatedAt.toISOString(),
  };
}

router.get("/cars", async (req, res): Promise<void> => {
  const parsed = ListCarsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const p = parsed.data;
  const page = p.page ?? 1;
  const limit = p.limit ?? 24;
  const offset = (page - 1) * limit;

  const conditions = buildCarFilters(p as Parameters<typeof buildCarFilters>[0]);
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  let orderBy;
  switch (p.sortBy) {
    case "price_asc": orderBy = asc(carsTable.price); break;
    case "price_desc": orderBy = desc(carsTable.price); break;
    case "year_desc": orderBy = desc(carsTable.year); break;
    case "mileage_asc": orderBy = asc(carsTable.mileage); break;
    default: orderBy = desc(carsTable.createdAt);
  }

  const [cars, [{ total }]] = await Promise.all([
    db.select().from(carsTable).where(whereClause).orderBy(orderBy).limit(limit).offset(offset),
    db.select({ total: count() }).from(carsTable).where(whereClause),
  ]);

  res.json({
    cars: cars.map((c) => formatCar(c)),
    total,
    page,
    limit,
  });
});

router.post("/cars", async (req, res): Promise<void> => {
  const parsed = CreateCarBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const data = parsed.data;
  const [car] = await db.insert(carsTable).values({
    ...data,
    price: String(data.price),
    deliveryFee: data.deliveryFee != null ? String(data.deliveryFee) : null,
    latitude: data.latitude != null ? String(data.latitude) : null,
    longitude: data.longitude != null ? String(data.longitude) : null,
    features: data.features ?? [],
    photos: data.photos ?? [],
    sellerId: data.sellerId ?? 1,
  }).returning();
  res.status(201).json(formatCar(car));
});

router.get("/cars/featured", async (req, res): Promise<void> => {
  const parsed = GetFeaturedCarsQueryParams.safeParse(req.query);
  const limit = parsed.success ? (parsed.data.limit ?? 12) : 12;
  const cars = await db.select().from(carsTable)
    .where(eq(carsTable.status, "active"))
    .orderBy(desc(carsTable.favoriteCount), desc(carsTable.createdAt))
    .limit(limit);
  res.json(cars.map((c) => formatCar(c)));
});

router.get("/cars/recent", async (req, res): Promise<void> => {
  const parsed = GetRecentCarsQueryParams.safeParse(req.query);
  const limit = parsed.success ? (parsed.data.limit ?? 8) : 8;
  const cars = await db.select().from(carsTable)
    .where(eq(carsTable.status, "active"))
    .orderBy(desc(carsTable.createdAt))
    .limit(limit);
  res.json(cars.map((c) => formatCar(c)));
});

router.get("/cars/:id", async (req, res): Promise<void> => {
  const params = GetCarParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [car] = await db.select().from(carsTable).where(eq(carsTable.id, params.data.id));
  if (!car) {
    res.status(404).json({ error: "Car not found" });
    return;
  }
  // Increment view count
  await db.update(carsTable).set({ viewCount: (car.viewCount ?? 0) + 1 }).where(eq(carsTable.id, car.id));
  res.json(formatCar(car));
});

router.patch("/cars/:id", async (req, res): Promise<void> => {
  const params = UpdateCarParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = UpdateCarBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const data = body.data;
  const [car] = await db.update(carsTable).set({
    ...data,
    price: data.price != null ? String(data.price) : undefined,
    deliveryFee: data.deliveryFee != null ? String(data.deliveryFee) : undefined,
    updatedAt: new Date(),
  }).where(eq(carsTable.id, params.data.id)).returning();
  if (!car) {
    res.status(404).json({ error: "Car not found" });
    return;
  }
  res.json(formatCar(car));
});

router.delete("/cars/:id", async (req, res): Promise<void> => {
  const params = DeleteCarParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [car] = await db.delete(carsTable).where(eq(carsTable.id, params.data.id)).returning();
  if (!car) {
    res.status(404).json({ error: "Car not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;

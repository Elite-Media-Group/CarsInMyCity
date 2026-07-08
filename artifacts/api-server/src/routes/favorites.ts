import { Router, type IRouter } from "express";
import { eq, and, inArray, sql } from "drizzle-orm";
import { db, favoritesTable, carsTable, usersTable } from "@workspace/db";
import { AddFavoriteBody, RemoveFavoriteParams } from "@workspace/api-zod";

const router: IRouter = Router();

async function getCurrentUserId(): Promise<number> {
  const [user] = await db.select().from(usersTable).limit(1);
  return user?.id ?? 1;
}

function formatCar(c: typeof carsTable.$inferSelect, isFavorited = true) {
  return {
    id: c.id,
    title: `${c.year} ${c.make} ${c.model}${c.trim ? " " + c.trim : ""}`,
    make: c.make, model: c.model, trim: c.trim ?? null, year: c.year,
    price: parseFloat(c.price), mileage: c.mileage, condition: c.condition,
    bodyStyle: c.bodyStyle ?? null, transmission: c.transmission ?? null,
    fuelType: c.fuelType ?? null, drivetrain: c.drivetrain ?? null,
    engineSize: c.engineSize ?? null, exteriorColor: c.exteriorColor ?? null,
    interiorColor: c.interiorColor ?? null, interiorType: c.interiorType ?? null,
    mpgCity: c.mpgCity ?? null, mpgHighway: c.mpgHighway ?? null,
    vin: c.vin ?? null, titleStatus: c.titleStatus ?? null,
    tireSize: c.tireSize ?? null, audioSystem: c.audioSystem ?? null,
    features: (c.features as string[]) ?? [], photos: (c.photos as string[]) ?? [],
    description: c.description ?? null, state: c.state, city: c.city, zipCode: c.zipCode,
    latitude: c.latitude ? parseFloat(c.latitude) : null,
    longitude: c.longitude ? parseFloat(c.longitude) : null,
    sellerType: c.sellerType, sellerId: c.sellerId, sellerName: null,
    deliveryAvailable: c.deliveryAvailable ?? false,
    deliveryFee: c.deliveryFee ? parseFloat(c.deliveryFee) : null,
    status: c.status, viewCount: c.viewCount ?? 0, favoriteCount: c.favoriteCount ?? 0,
    isFavorited,
    createdAt: c.createdAt.toISOString(), updatedAt: c.updatedAt.toISOString(),
  };
}

router.get("/favorites", async (_req, res): Promise<void> => {
  const userId = await getCurrentUserId();
  const favRows = await db.select().from(favoritesTable)
    .where(eq(favoritesTable.userId, userId));
  const carIds = favRows.map((f) => f.carId);
  if (carIds.length === 0) {
    res.json([]);
    return;
  }
  const cars = await db.select().from(carsTable)
    .where(inArray(carsTable.id, carIds));
  res.json(cars.map((c) => formatCar(c, true)));
});

router.post("/favorites", async (req, res): Promise<void> => {
  const parsed = AddFavoriteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { carId } = parsed.data;
  const userId = await getCurrentUserId();

  const existing = await db.select().from(favoritesTable)
    .where(and(eq(favoritesTable.userId, userId), eq(favoritesTable.carId, carId)));
  if (existing.length > 0) {
    res.status(201).json({
      id: existing[0].id,
      userId: existing[0].userId,
      carId: existing[0].carId,
      createdAt: existing[0].createdAt.toISOString(),
    });
    return;
  }

  const [fav] = await db.insert(favoritesTable)
    .values({ userId, carId })
    .returning();
  await db.update(carsTable)
    .set({ favoriteCount: sql`${carsTable.favoriteCount} + 1` })
    .where(eq(carsTable.id, carId));
  res.status(201).json({
    id: fav.id,
    userId: fav.userId,
    carId: fav.carId,
    createdAt: fav.createdAt.toISOString(),
  });
});

router.delete("/favorites/:carId", async (req, res): Promise<void> => {
  const params = RemoveFavoriteParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const userId = await getCurrentUserId();
  const deleted = await db.delete(favoritesTable)
    .where(and(eq(favoritesTable.userId, userId), eq(favoritesTable.carId, params.data.carId)))
    .returning();
  if (deleted.length > 0) {
    await db.update(carsTable)
      .set({ favoriteCount: sql`GREATEST(${carsTable.favoriteCount} - 1, 0)` })
      .where(eq(carsTable.id, params.data.carId));
  }
  res.sendStatus(204);
});

export default router;

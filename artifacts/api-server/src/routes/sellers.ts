import { Router, type IRouter } from "express";
import { eq, count } from "drizzle-orm";
import { db, sellerProfilesTable, carsTable, usersTable } from "@workspace/db";
import { UpdateMySellerProfileBody, GetSellerProfileParams } from "@workspace/api-zod";

const router: IRouter = Router();

function formatProfile(profile: typeof sellerProfilesTable.$inferSelect, totalListings = 0) {
  return {
    id: profile.id,
    userId: profile.userId,
    sellerType: profile.sellerType,
    displayName: profile.displayName,
    businessName: profile.businessName ?? null,
    description: profile.description ?? null,
    logoUrl: profile.logoUrl ?? null,
    phone: profile.phone ?? null,
    email: profile.email ?? null,
    website: profile.website ?? null,
    address: profile.address ?? null,
    city: profile.city ?? null,
    state: profile.state ?? null,
    zipCode: profile.zipCode ?? null,
    latitude: profile.latitude ? parseFloat(profile.latitude) : null,
    longitude: profile.longitude ? parseFloat(profile.longitude) : null,
    totalListings,
    rating: profile.rating ? parseFloat(profile.rating) : null,
    reviewCount: profile.reviewCount ?? 0,
    offerDelivery: profile.offerDelivery ?? false,
  };
}

async function getCurrentUserId(): Promise<number> {
  const [user] = await db.select().from(usersTable).limit(1);
  return user?.id ?? 1;
}

router.get("/sellers/me", async (req, res): Promise<void> => {
  const userId = await getCurrentUserId();
  const [profile] = await db.select().from(sellerProfilesTable).where(eq(sellerProfilesTable.userId, userId));
  if (!profile) {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    const displayName = user
      ? `${user.firstName} ${user.lastName}`.trim() || "My Profile"
      : "My Profile";
    const [created] = await db
      .insert(sellerProfilesTable)
      .values({ userId, displayName, sellerType: "private" })
      .returning();
    res.json(formatProfile(created, 0));
    return;
  }
  const [{ total }] = await db.select({ total: count() }).from(carsTable).where(eq(carsTable.sellerId, userId));
  res.json(formatProfile(profile, total));
});

router.patch("/sellers/me", async (req, res): Promise<void> => {
  const parsed = UpdateMySellerProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const userId = await getCurrentUserId();
  const data = parsed.data;

  const updateData: Partial<typeof sellerProfilesTable.$inferInsert> = {
    displayName: data.displayName,
    businessName: data.businessName,
    description: data.description,
    logoUrl: data.logoUrl,
    phone: data.phone,
    email: data.email,
    website: data.website,
    address: data.address,
    city: data.city,
    state: data.state,
    zipCode: data.zipCode,
    offerDelivery: data.offerDelivery,
  };

  if (data.sellerType) {
    updateData.sellerType = data.sellerType as "dealer" | "private" | "certified_dealer";
  }

  const [profile] = await db
    .update(sellerProfilesTable)
    .set(updateData)
    .where(eq(sellerProfilesTable.userId, userId))
    .returning();
  if (!profile) {
    res.status(404).json({ error: "Seller profile not found" });
    return;
  }
  res.json(formatProfile(profile));
});

router.get("/sellers/me/listings", async (req, res): Promise<void> => {
  const userId = await getCurrentUserId();
  const cars = await db.select().from(carsTable).where(eq(carsTable.sellerId, userId));
  res.json(cars.map((c) => ({
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
    isFavorited: false,
    createdAt: c.createdAt.toISOString(), updatedAt: c.updatedAt.toISOString(),
  })));
});

router.get("/sellers/:id", async (req, res): Promise<void> => {
  const params = GetSellerProfileParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [profile] = await db.select().from(sellerProfilesTable)
    .where(eq(sellerProfilesTable.id, params.data.id));
  if (!profile) {
    res.status(404).json({ error: "Seller profile not found" });
    return;
  }
  const [{ total }] = await db.select({ total: count() }).from(carsTable)
    .where(eq(carsTable.sellerId, profile.userId));
  res.json(formatProfile(profile, total));
});

export default router;

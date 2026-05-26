import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, buyerProfilesTable, usersTable } from "@workspace/db";
import { UpdateMyBuyerProfileBody } from "@workspace/api-zod";

const router: IRouter = Router();

async function getCurrentUserId(): Promise<number> {
  const [user] = await db.select().from(usersTable).limit(1);
  return user?.id ?? 1;
}

function formatProfile(profile: typeof buyerProfilesTable.$inferSelect) {
  return {
    id: profile.id,
    userId: profile.userId,
    preferredMakes: (profile.preferredMakes as string[]) ?? [],
    preferredBodyStyles: (profile.preferredBodyStyles as string[]) ?? [],
    maxPrice: profile.maxPrice ? parseFloat(profile.maxPrice) : null,
    minYear: profile.minYear ?? null,
    maxMileage: profile.maxMileage ?? null,
    preferredColors: (profile.preferredColors as string[]) ?? [],
    fuelType: profile.fuelType ?? null,
    transmission: profile.transmission ?? null,
    useLocation: profile.useLocation ?? false,
    zipCode: profile.zipCode ?? null,
    searchRadius: profile.searchRadius ?? null,
    notifyOnMatch: profile.notifyOnMatch ?? false,
  };
}

router.get("/buyers/me", async (req, res): Promise<void> => {
  const userId = await getCurrentUserId();
  const [profile] = await db.select().from(buyerProfilesTable).where(eq(buyerProfilesTable.userId, userId));
  if (!profile) {
    // Auto-create
    const [created] = await db.insert(buyerProfilesTable).values({ userId }).returning();
    res.json(formatProfile(created));
    return;
  }
  res.json(formatProfile(profile));
});

router.patch("/buyers/me", async (req, res): Promise<void> => {
  const parsed = UpdateMyBuyerProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const userId = await getCurrentUserId();
  const data = parsed.data;
  const [profile] = await db.update(buyerProfilesTable).set({
    ...data,
    maxPrice: data.maxPrice != null ? String(data.maxPrice) : undefined,
  }).where(eq(buyerProfilesTable.userId, userId)).returning();
  if (!profile) {
    res.status(404).json({ error: "Buyer profile not found" });
    return;
  }
  res.json(formatProfile(profile));
});

export default router;

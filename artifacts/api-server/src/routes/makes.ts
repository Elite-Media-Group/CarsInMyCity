import { Router, type IRouter } from "express";
import { eq, count } from "drizzle-orm";
import { db, carMakesTable, carModelsTable, carsTable } from "@workspace/db";
import { ListModelsParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/makes", async (req, res): Promise<void> => {
  const makes = await db.select().from(carMakesTable).orderBy(carMakesTable.name);
  const counts = await db.select({ make: carsTable.make, total: count() })
    .from(carsTable).groupBy(carsTable.make);
  const countMap = new Map(counts.map((c) => [c.make.toLowerCase(), c.total]));
  res.json(makes.map((m) => ({
    id: m.id,
    name: m.name,
    logoUrl: m.logoUrl ?? null,
    listingCount: countMap.get(m.name.toLowerCase()) ?? 0,
  })));
});

router.get("/makes/:makeId/models", async (req, res): Promise<void> => {
  const params = ListModelsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const models = await db.select().from(carModelsTable)
    .where(eq(carModelsTable.makeId, params.data.makeId))
    .orderBy(carModelsTable.name);
  res.json(models.map((m) => ({ id: m.id, makeId: m.makeId, name: m.name })));
});

export default router;

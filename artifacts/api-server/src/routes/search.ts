import { Router, type IRouter } from "express";
import { ilike, sql } from "drizzle-orm";
import { db, carsTable, carMakesTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/search/suggestions", async (req, res): Promise<void> => {
  const q = String(req.query.q ?? "").trim();
  if (!q || q.length < 2) {
    res.json([]);
    return;
  }

  const [makes, cities, states] = await Promise.all([
    db.select().from(carMakesTable).where(ilike(carMakesTable.name, `${q}%`)).limit(5),
    db.selectDistinct({ city: carsTable.city, state: carsTable.state })
      .from(carsTable).where(ilike(carsTable.city, `${q}%`)).limit(5),
    db.selectDistinct({ state: carsTable.state })
      .from(carsTable).where(ilike(carsTable.state, `${q}%`)).limit(3),
  ]);

  const suggestions = [
    ...makes.map((m) => ({ type: "make" as const, label: m.name, value: m.name })),
    ...cities.map((c) => ({ type: "city" as const, label: `${c.city}, ${c.state}`, value: c.city })),
    ...states.map((s) => ({ type: "state" as const, label: s.state, value: s.state })),
  ].slice(0, 10);

  res.json(suggestions);
});

export default router;

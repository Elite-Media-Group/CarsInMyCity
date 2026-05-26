import { Router, type IRouter } from "express";
import { eq, count, avg, gte, sql } from "drizzle-orm";
import { db, carsTable, usersTable, sellerProfilesTable } from "@workspace/db";

const router: IRouter = Router();

const STATE_CODES: Record<string, string> = {
  "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR", "California": "CA",
  "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE", "Florida": "FL", "Georgia": "GA",
  "Hawaii": "HI", "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA",
  "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
  "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS", "Missouri": "MO",
  "Montana": "MT", "Nebraska": "NE", "Nevada": "NV", "New Hampshire": "NH", "New Jersey": "NJ",
  "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH",
  "Oklahoma": "OK", "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
  "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT", "Vermont": "VT",
  "Virginia": "VA", "Washington": "WA", "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY",
};

router.get("/stats/summary", async (req, res): Promise<void> => {
  const [totalListings] = await db.select({ total: count() }).from(carsTable).where(eq(carsTable.status, "active"));
  const [totalSellers] = await db.select({ total: count() }).from(sellerProfilesTable);
  const [totalBuyers] = await db.select({ total: count() }).from(usersTable);
  const [avgPriceResult] = await db.select({ avg: avg(carsTable.price) }).from(carsTable).where(eq(carsTable.status, "active"));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [newToday] = await db.select({ total: count() }).from(carsTable).where(gte(carsTable.createdAt, today));

  const makeGroups = await db.select({ make: carsTable.make, total: count() })
    .from(carsTable).where(eq(carsTable.status, "active")).groupBy(carsTable.make).limit(1);
  const stateGroups = await db.select({ state: carsTable.state, total: count() })
    .from(carsTable).where(eq(carsTable.status, "active")).groupBy(carsTable.state).limit(1);

  res.json({
    totalListings: totalListings.total,
    totalSellers: totalSellers.total,
    totalBuyers: totalBuyers.total,
    avgPrice: parseFloat(avgPriceResult.avg ?? "0"),
    newListingsToday: newToday.total,
    popularMake: makeGroups[0]?.make ?? null,
    popularState: stateGroups[0]?.state ?? null,
  });
});

router.get("/stats/by-state", async (req, res): Promise<void> => {
  const rows = await db.select({ state: carsTable.state, total: count() })
    .from(carsTable).where(eq(carsTable.status, "active")).groupBy(carsTable.state).orderBy(sql`count(*) desc`);
  res.json(rows.map((r) => ({
    state: r.state,
    stateCode: STATE_CODES[r.state] ?? r.state.slice(0, 2).toUpperCase(),
    count: r.total,
  })));
});

router.get("/stats/price-ranges", async (req, res): Promise<void> => {
  const ranges = [
    { label: "Under $5K", min: 0, max: 5000 },
    { label: "$5K - $10K", min: 5000, max: 10000 },
    { label: "$10K - $20K", min: 10000, max: 20000 },
    { label: "$20K - $35K", min: 20000, max: 35000 },
    { label: "$35K - $50K", min: 35000, max: 50000 },
    { label: "$50K+", min: 50000, max: 10000000 },
  ];
  const result = await Promise.all(ranges.map(async ({ label, min, max }) => {
    const [{ total }] = await db.select({ total: count() }).from(carsTable)
      .where(sql`status = 'active' AND CAST(price AS NUMERIC) >= ${min} AND CAST(price AS NUMERIC) < ${max}`);
    return { label, min, max, count: total };
  }));
  res.json(result);
});

router.get("/stats/top-makes", async (req, res): Promise<void> => {
  const limit = parseInt(String(req.query.limit ?? "10"), 10);
  const rows = await db.select({ make: carsTable.make, total: count() })
    .from(carsTable).where(eq(carsTable.status, "active"))
    .groupBy(carsTable.make).orderBy(sql`count(*) desc`).limit(limit);
  res.json(rows.map((r) => ({ make: r.make, count: r.total })));
});

export default router;

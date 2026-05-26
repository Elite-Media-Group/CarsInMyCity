import { Router, type IRouter } from "express";
import { eq, or } from "drizzle-orm";
import { db, inquiriesTable, carsTable, usersTable } from "@workspace/db";
import { CreateInquiryBody, GetInquiryParams } from "@workspace/api-zod";

const router: IRouter = Router();

async function getCurrentUserId(): Promise<number> {
  const [user] = await db.select().from(usersTable).limit(1);
  return user?.id ?? 1;
}

async function formatInquiry(inq: typeof inquiriesTable.$inferSelect) {
  const [car] = await db.select().from(carsTable).where(eq(carsTable.id, inq.carId));
  return {
    id: inq.id,
    carId: inq.carId,
    buyerId: inq.buyerId,
    sellerId: inq.sellerId,
    message: inq.message,
    buyerName: inq.buyerName ?? null,
    buyerEmail: inq.buyerEmail ?? null,
    buyerPhone: inq.buyerPhone ?? null,
    carTitle: car ? `${car.year} ${car.make} ${car.model}` : null,
    status: inq.status,
    wantsDelivery: inq.wantsDelivery ?? false,
    tradeIn: inq.tradeIn ?? false,
    financing: inq.financing ?? false,
    createdAt: inq.createdAt.toISOString(),
  };
}

router.get("/inquiries", async (req, res): Promise<void> => {
  const userId = await getCurrentUserId();
  const inquiries = await db.select().from(inquiriesTable)
    .where(or(eq(inquiriesTable.buyerId, userId), eq(inquiriesTable.sellerId, userId)));
  const formatted = await Promise.all(inquiries.map(formatInquiry));
  res.json(formatted);
});

router.post("/inquiries", async (req, res): Promise<void> => {
  const parsed = CreateInquiryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const buyerId = await getCurrentUserId();
  const { carId, message, buyerName, buyerEmail, buyerPhone, wantsDelivery, tradeIn, financing } = parsed.data;

  const [car] = await db.select().from(carsTable).where(eq(carsTable.id, carId));
  if (!car) {
    res.status(404).json({ error: "Car not found" });
    return;
  }

  const [inq] = await db.insert(inquiriesTable).values({
    carId,
    buyerId,
    sellerId: car.sellerId,
    message,
    buyerName: buyerName ?? null,
    buyerEmail: buyerEmail ?? null,
    buyerPhone: buyerPhone ?? null,
    wantsDelivery: wantsDelivery ?? false,
    tradeIn: tradeIn ?? false,
    financing: financing ?? false,
  }).returning();

  res.status(201).json(await formatInquiry(inq));
});

router.get("/inquiries/:id", async (req, res): Promise<void> => {
  const params = GetInquiryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [inq] = await db.select().from(inquiriesTable).where(eq(inquiriesTable.id, params.data.id));
  if (!inq) {
    res.status(404).json({ error: "Inquiry not found" });
    return;
  }
  res.json(await formatInquiry(inq));
});

export default router;

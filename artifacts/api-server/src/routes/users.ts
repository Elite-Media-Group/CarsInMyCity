import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable, sellerProfilesTable, buyerProfilesTable } from "@workspace/db";
import {
  RegisterUserBody,
  LoginUserBody,
  UpdateMeBody,
} from "@workspace/api-zod";
import crypto from "crypto";

const router: IRouter = Router();

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "cimc-salt").digest("hex");
}

function formatUser(user: typeof usersTable.$inferSelect) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone ?? null,
    avatarUrl: user.avatarUrl ?? null,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  };
}

router.post("/users/register", async (req, res): Promise<void> => {
  const parsed = RegisterUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { email, password, firstName, lastName, phone, role } = parsed.data;

  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (existing.length > 0) {
    res.status(400).json({ error: "Email already registered" });
    return;
  }

  const [user] = await db.insert(usersTable).values({
    email,
    passwordHash: hashPassword(password),
    firstName,
    lastName,
    phone: phone ?? null,
    role: role as "buyer" | "seller" | "both",
  }).returning();

  // Create default profiles
  if (role === "seller" || role === "both") {
    await db.insert(sellerProfilesTable).values({
      userId: user.id,
      sellerType: "private",
      displayName: `${firstName} ${lastName}`,
    }).onConflictDoNothing();
  }
  if (role === "buyer" || role === "both") {
    await db.insert(buyerProfilesTable).values({ userId: user.id }).onConflictDoNothing();
  }

  res.status(201).json(formatUser(user));
});

router.post("/users/login", async (req, res): Promise<void> => {
  const parsed = LoginUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { email, password } = parsed.data;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (!user || user.passwordHash !== hashPassword(password)) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }
  res.json(formatUser(user));
});

router.get("/users/me", async (req, res): Promise<void> => {
  // In a real app this would use session/JWT. For demo, return first user.
  const [user] = await db.select().from(usersTable).limit(1);
  if (!user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  res.json(formatUser(user));
});

router.patch("/users/me", async (req, res): Promise<void> => {
  const parsed = UpdateMeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [user] = await db.select().from(usersTable).limit(1);
  if (!user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const [updated] = await db.update(usersTable).set({
    ...parsed.data,
    updatedAt: new Date(),
  }).where(eq(usersTable.id, user.id)).returning();
  res.json(formatUser(updated));
});

export default router;

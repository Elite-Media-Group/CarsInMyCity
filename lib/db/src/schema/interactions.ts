import { pgTable, serial, integer, text, boolean, timestamp, pgEnum, uniqueIndex, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const inquiryStatusEnum = pgEnum("inquiry_status", ["pending", "replied", "closed"]);

export const favoritesTable = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  carId: integer("car_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  userCarUnique: uniqueIndex("favorites_user_car_unique").on(table.userId, table.carId),
  userIdx: index("favorites_user_idx").on(table.userId),
}));

export const inquiriesTable = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  carId: integer("car_id").notNull(),
  buyerId: integer("buyer_id").notNull(),
  sellerId: integer("seller_id").notNull(),
  message: text("message").notNull(),
  buyerName: text("buyer_name"),
  buyerEmail: text("buyer_email"),
  buyerPhone: text("buyer_phone"),
  status: inquiryStatusEnum("status").notNull().default("pending"),
  wantsDelivery: boolean("wants_delivery").default(false),
  tradeIn: boolean("trade_in").default(false),
  financing: boolean("financing").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  buyerIdx: index("inquiries_buyer_idx").on(table.buyerId),
  sellerIdx: index("inquiries_seller_idx").on(table.sellerId),
  carIdx: index("inquiries_car_idx").on(table.carId),
}));

export const insertFavoriteSchema = createInsertSchema(favoritesTable).omit({ id: true, createdAt: true });
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favoritesTable.$inferSelect;

export const insertInquirySchema = createInsertSchema(inquiriesTable).omit({ id: true, createdAt: true });
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Inquiry = typeof inquiriesTable.$inferSelect;

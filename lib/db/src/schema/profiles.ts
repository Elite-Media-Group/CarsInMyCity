import { pgTable, serial, integer, text, numeric, boolean, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const sellerTypeEnum = pgEnum("seller_profile_type", ["dealer", "private", "certified_dealer"]);

export const sellerProfilesTable = pgTable("seller_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  sellerType: sellerTypeEnum("seller_type").notNull().default("private"),
  displayName: text("display_name").notNull(),
  businessName: text("business_name"),
  description: text("description"),
  logoUrl: text("logo_url"),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),
  rating: numeric("rating", { precision: 3, scale: 2 }),
  reviewCount: integer("review_count").default(0),
  offerDelivery: boolean("offer_delivery").default(false),
});

export const buyerProfilesTable = pgTable("buyer_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  preferredMakes: jsonb("preferred_makes").$type<string[]>().default([]),
  preferredBodyStyles: jsonb("preferred_body_styles").$type<string[]>().default([]),
  maxPrice: numeric("max_price", { precision: 12, scale: 2 }),
  minYear: integer("min_year"),
  maxMileage: integer("max_mileage"),
  preferredColors: jsonb("preferred_colors").$type<string[]>().default([]),
  fuelType: text("fuel_type"),
  transmission: text("transmission"),
  useLocation: boolean("use_location").default(false),
  zipCode: text("zip_code"),
  searchRadius: integer("search_radius"),
  notifyOnMatch: boolean("notify_on_match").default(false),
});

export const insertSellerProfileSchema = createInsertSchema(sellerProfilesTable).omit({ id: true });
export type InsertSellerProfile = z.infer<typeof insertSellerProfileSchema>;
export type SellerProfile = typeof sellerProfilesTable.$inferSelect;

export const insertBuyerProfileSchema = createInsertSchema(buyerProfilesTable).omit({ id: true });
export type InsertBuyerProfile = z.infer<typeof insertBuyerProfileSchema>;
export type BuyerProfile = typeof buyerProfilesTable.$inferSelect;

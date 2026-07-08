import {
  pgTable, serial, text, integer, numeric, boolean, timestamp, pgEnum, jsonb, index
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const carConditionEnum = pgEnum("car_condition", ["new", "used", "certified"]);
export const carSellerTypeEnum = pgEnum("car_seller_type", ["dealer", "private", "certified_dealer"]);
export const carStatusEnum = pgEnum("car_status", ["active", "sold", "pending", "draft"]);

export const carsTable = pgTable("cars", {
  id: serial("id").primaryKey(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  trim: text("trim"),
  year: integer("year").notNull(),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  mileage: integer("mileage").notNull(),
  condition: carConditionEnum("condition").notNull(),
  bodyStyle: text("body_style"),
  transmission: text("transmission"),
  fuelType: text("fuel_type"),
  drivetrain: text("drivetrain"),
  engineSize: text("engine_size"),
  exteriorColor: text("exterior_color"),
  interiorColor: text("interior_color"),
  interiorType: text("interior_type"),
  mpgCity: integer("mpg_city"),
  mpgHighway: integer("mpg_highway"),
  vin: text("vin"),
  titleStatus: text("title_status"),
  tireSize: text("tire_size"),
  audioSystem: text("audio_system"),
  features: jsonb("features").$type<string[]>().default([]),
  photos: jsonb("photos").$type<string[]>().default([]),
  description: text("description"),
  state: text("state").notNull(),
  city: text("city").notNull(),
  zipCode: text("zip_code").notNull(),
  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),
  sellerType: carSellerTypeEnum("seller_type").notNull(),
  sellerId: integer("seller_id").notNull(),
  deliveryAvailable: boolean("delivery_available").default(false),
  deliveryFee: numeric("delivery_fee", { precision: 10, scale: 2 }),
  status: carStatusEnum("status").notNull().default("active"),
  viewCount: integer("view_count").default(0),
  favoriteCount: integer("favorite_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  makeIdx: index("cars_make_idx").on(table.make),
  modelIdx: index("cars_model_idx").on(table.model),
  stateIdx: index("cars_state_idx").on(table.state),
  cityIdx: index("cars_city_idx").on(table.city),
  priceIdx: index("cars_price_idx").on(table.price),
  statusIdx: index("cars_status_idx").on(table.status),
}));

export const insertCarSchema = createInsertSchema(carsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCar = z.infer<typeof insertCarSchema>;
export type Car = typeof carsTable.$inferSelect;

import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const carMakesTable = pgTable("car_makes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  logoUrl: text("logo_url"),
});

export const carModelsTable = pgTable("car_models", {
  id: serial("id").primaryKey(),
  makeId: integer("make_id").notNull(),
  name: text("name").notNull(),
});

export const insertCarMakeSchema = createInsertSchema(carMakesTable).omit({ id: true });
export type InsertCarMake = z.infer<typeof insertCarMakeSchema>;
export type CarMake = typeof carMakesTable.$inferSelect;

export const insertCarModelSchema = createInsertSchema(carModelsTable).omit({ id: true });
export type InsertCarModel = z.infer<typeof insertCarModelSchema>;
export type CarModel = typeof carModelsTable.$inferSelect;

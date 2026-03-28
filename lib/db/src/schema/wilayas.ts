import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const wilayasTable = pgTable("wilayas", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  nameAr: text("name_ar").notNull(),
  nameFr: text("name_fr").notNull(),
  region: text("region").notNull(),
});

export const communesTable = pgTable("communes", {
  id: serial("id").primaryKey(),
  wilayaId: integer("wilaya_id").notNull().references(() => wilayasTable.id),
  nameAr: text("name_ar").notNull(),
  nameFr: text("name_fr").notNull(),
});

export const insertWilayaSchema = createInsertSchema(wilayasTable).omit({ id: true });
export const insertCommuneSchema = createInsertSchema(communesTable).omit({ id: true });

export type InsertWilaya = z.infer<typeof insertWilayaSchema>;
export type Wilaya = typeof wilayasTable.$inferSelect;
export type InsertCommune = z.infer<typeof insertCommuneSchema>;
export type Commune = typeof communesTable.$inferSelect;

import { pgTable, serial, text, integer, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { wilayasTable, communesTable } from "./wilayas";

export const serviceCategoriesTable = pgTable("service_categories", {
  id: serial("id").primaryKey(),
  nameAr: text("name_ar").notNull(),
  nameFr: text("name_fr").notNull(),
  nameEn: text("name_en").notNull(),
  icon: text("icon").notNull(),
  description: text("description").notNull(),
  color: text("color").notNull(),
});

export const officesTable = pgTable("offices", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameAr: text("name_ar").notNull(),
  categoryId: integer("category_id").notNull().references(() => serviceCategoriesTable.id),
  wilayaId: integer("wilaya_id").notNull().references(() => wilayasTable.id),
  communeId: integer("commune_id").references(() => communesTable.id),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  openTime: text("open_time").notNull().default("08:00"),
  closeTime: text("close_time").notNull().default("16:00"),
  workingDays: jsonb("working_days").$type<string[]>().notNull().default(["Sunday","Monday","Tuesday","Wednesday","Thursday"]),
  description: text("description").notNull().default(""),
  rating: real("rating").notNull().default(3.5),
});

export const officeServicesTable = pgTable("office_services", {
  id: serial("id").primaryKey(),
  officeId: integer("office_id").notNull().references(() => officesTable.id),
  nameAr: text("name_ar").notNull(),
  nameFr: text("name_fr").notNull(),
  duration: integer("duration").notNull().default(15),
  requiredDocuments: jsonb("required_documents").$type<string[]>().notNull().default([]),
  fee: real("fee").notNull().default(0),
});

export const insertServiceCategorySchema = createInsertSchema(serviceCategoriesTable).omit({ id: true });
export const insertOfficeSchema = createInsertSchema(officesTable).omit({ id: true });
export const insertOfficeServiceSchema = createInsertSchema(officeServicesTable).omit({ id: true });

export type InsertServiceCategory = z.infer<typeof insertServiceCategorySchema>;
export type ServiceCategory = typeof serviceCategoriesTable.$inferSelect;
export type InsertOffice = z.infer<typeof insertOfficeSchema>;
export type Office = typeof officesTable.$inferSelect;
export type InsertOfficeService = z.infer<typeof insertOfficeServiceSchema>;
export type OfficeService = typeof officeServicesTable.$inferSelect;

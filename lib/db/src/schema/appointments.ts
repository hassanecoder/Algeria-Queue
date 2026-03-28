import { pgTable, serial, text, integer, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { officesTable, officeServicesTable } from "./services";

export const appointmentsTable = pgTable("appointments", {
  id: serial("id").primaryKey(),
  ticketNumber: text("ticket_number").notNull().unique(),
  officeId: integer("office_id").notNull().references(() => officesTable.id),
  serviceId: integer("service_id").notNull().references(() => officeServicesTable.id),
  citizenName: text("citizen_name").notNull(),
  citizenPhone: text("citizen_phone").notNull(),
  citizenNationalId: text("citizen_national_id").notNull(),
  date: date("date").notNull(),
  time: text("time").notNull(),
  status: text("status").notNull().default("pending"),
  queuePosition: integer("queue_position").notNull().default(0),
  notes: text("notes").default(""),
  calledAt: timestamp("called_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAppointmentSchema = createInsertSchema(appointmentsTable).omit({ id: true, createdAt: true });
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointmentsTable.$inferSelect;

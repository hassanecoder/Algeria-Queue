import { Router } from "express";
import { db } from "@workspace/db";
import { appointmentsTable, officesTable, officeServicesTable } from "@workspace/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { CreateAppointmentBody } from "@workspace/api-zod";

const router = Router();

function generateTicket(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 90000) + 10000;
  return `DZ-${year}-${rand}`;
}

async function enrichAppointment(appt: typeof appointmentsTable.$inferSelect) {
  const office = await db.select({ name: officesTable.name }).from(officesTable).where(eq(officesTable.id, appt.officeId));
  const service = await db.select({ nameFr: officeServicesTable.nameFr }).from(officeServicesTable).where(eq(officeServicesTable.id, appt.serviceId));

  const waiting = await db.select({ count: sql<number>`count(*)::int` })
    .from(appointmentsTable)
    .where(and(
      eq(appointmentsTable.officeId, appt.officeId),
      eq(appointmentsTable.date, appt.date),
      sql`status IN ('pending', 'confirmed')`,
      sql`queue_position < ${appt.queuePosition}`
    ));

  return {
    id: appt.id,
    ticketNumber: appt.ticketNumber,
    officeId: appt.officeId,
    officeName: office[0]?.name ?? "",
    serviceId: appt.serviceId,
    serviceName: service[0]?.nameFr ?? "",
    citizenName: appt.citizenName,
    citizenPhone: appt.citizenPhone,
    citizenNationalId: appt.citizenNationalId,
    date: appt.date,
    time: appt.time,
    status: appt.status,
    queuePosition: appt.queuePosition,
    estimatedWaitMinutes: (waiting[0]?.count ?? 0) * 15,
    createdAt: appt.createdAt.toISOString(),
  };
}

router.get("/appointments", async (req, res) => {
  const { phone } = req.query;
  if (!phone) {
    res.status(400).json({ error: "bad_request", message: "Phone required" });
    return;
  }

  const appts = await db.select().from(appointmentsTable)
    .where(eq(appointmentsTable.citizenPhone, phone as string))
    .orderBy(sql`created_at DESC`);

  const enriched = await Promise.all(appts.map(enrichAppointment));
  res.json(enriched);
});

router.post("/appointments", async (req, res) => {
  const parsed = CreateAppointmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_error", message: parsed.error.message });
    return;
  }

  const body = parsed.data;

  const existing = await db.select({ count: sql<number>`count(*)::int` })
    .from(appointmentsTable)
    .where(and(
      eq(appointmentsTable.officeId, body.officeId),
      eq(appointmentsTable.date, body.date),
      eq(appointmentsTable.time, body.time),
      sql`status NOT IN ('cancelled', 'no_show')`
    ));

  if ((existing[0]?.count ?? 0) >= 3) {
    res.status(409).json({ error: "slot_unavailable", message: "Ce créneau est complet" });
    return;
  }

  const posCount = await db.select({ count: sql<number>`count(*)::int` })
    .from(appointmentsTable)
    .where(and(
      eq(appointmentsTable.officeId, body.officeId),
      eq(appointmentsTable.date, body.date)
    ));
  const queuePosition = (posCount[0]?.count ?? 0) + 1;

  const ticket = generateTicket();

  const [appt] = await db.insert(appointmentsTable).values({
    ticketNumber: ticket,
    officeId: body.officeId,
    serviceId: body.serviceId,
    citizenName: body.citizenName,
    citizenPhone: body.citizenPhone,
    citizenNationalId: body.citizenNationalId,
    date: body.date,
    time: body.time,
    status: "confirmed",
    queuePosition,
    notes: body.notes ?? "",
  }).returning();

  res.status(201).json(await enrichAppointment(appt));
});

router.get("/appointments/:appointmentId", async (req, res) => {
  const id = parseInt(req.params.appointmentId);
  if (isNaN(id)) {
    res.status(400).json({ error: "bad_request", message: "Invalid id" });
    return;
  }
  const appts = await db.select().from(appointmentsTable).where(eq(appointmentsTable.id, id));
  if (appts.length === 0) {
    res.status(404).json({ error: "not_found", message: "Appointment not found" });
    return;
  }
  res.json(await enrichAppointment(appts[0]));
});

router.post("/appointments/:appointmentId/cancel", async (req, res) => {
  const id = parseInt(req.params.appointmentId);
  if (isNaN(id)) {
    res.status(400).json({ error: "bad_request", message: "Invalid id" });
    return;
  }
  const appts = await db.select().from(appointmentsTable).where(eq(appointmentsTable.id, id));
  if (appts.length === 0) {
    res.status(404).json({ error: "not_found", message: "Appointment not found" });
    return;
  }
  const [updated] = await db.update(appointmentsTable).set({ status: "cancelled" }).where(eq(appointmentsTable.id, id)).returning();
  res.json(await enrichAppointment(updated));
});

export default router;

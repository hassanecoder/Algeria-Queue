import { Router } from "express";
import { db } from "@workspace/db";
import { appointmentsTable, officesTable, officeServicesTable } from "@workspace/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { AdminUpdateAppointmentStatusBody } from "@workspace/api-zod";

const router = Router();

router.get("/admin/offices/:officeId/queue", async (req, res) => {
  const officeId = parseInt(req.params.officeId);
  const date = (req.query.date as string) ?? new Date().toISOString().split("T")[0];

  if (isNaN(officeId)) {
    res.status(400).json({ error: "bad_request", message: "Invalid officeId" });
    return;
  }

  const appts = await db.select().from(appointmentsTable)
    .where(and(eq(appointmentsTable.officeId, officeId), eq(appointmentsTable.date, date)))
    .orderBy(appointmentsTable.queuePosition);

  const enriched = await Promise.all(appts.map(async (a) => {
    const office = await db.select({ name: officesTable.name }).from(officesTable).where(eq(officesTable.id, a.officeId));
    const service = await db.select({ nameFr: officeServicesTable.nameFr }).from(officeServicesTable).where(eq(officeServicesTable.id, a.serviceId));
    return {
      id: a.id,
      ticketNumber: a.ticketNumber,
      officeId: a.officeId,
      officeName: office[0]?.name ?? "",
      serviceId: a.serviceId,
      serviceName: service[0]?.nameFr ?? "",
      citizenName: a.citizenName,
      citizenPhone: a.citizenPhone,
      citizenNationalId: a.citizenNationalId,
      date: a.date,
      time: a.time,
      status: a.status,
      queuePosition: a.queuePosition,
      estimatedWaitMinutes: 0,
      createdAt: a.createdAt.toISOString(),
      calledAt: a.calledAt?.toISOString(),
      completedAt: a.completedAt?.toISOString(),
    };
  }));

  res.json(enriched);
});

router.patch("/admin/offices/:officeId/appointments/:appointmentId/status", async (req, res) => {
  const appointmentId = parseInt(req.params.appointmentId);
  if (isNaN(appointmentId)) {
    res.status(400).json({ error: "bad_request", message: "Invalid id" });
    return;
  }

  const parsed = AdminUpdateAppointmentStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_error", message: parsed.error.message });
    return;
  }

  const { status } = parsed.data;
  const now = new Date();
  const updates: Record<string, unknown> = { status };

  if (status === "called" || status === "in_progress") {
    updates.calledAt = now;
  }
  if (status === "completed" || status === "no_show") {
    updates.completedAt = now;
  }

  const [updated] = await db.update(appointmentsTable)
    .set(updates as Parameters<typeof db.update>[0] extends (table: unknown, value: infer V) => unknown ? V : never)
    .where(eq(appointmentsTable.id, appointmentId))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "not_found", message: "Appointment not found" });
    return;
  }

  const office = await db.select({ name: officesTable.name }).from(officesTable).where(eq(officesTable.id, updated.officeId));
  const service = await db.select({ nameFr: officeServicesTable.nameFr }).from(officeServicesTable).where(eq(officeServicesTable.id, updated.serviceId));

  res.json({
    id: updated.id,
    ticketNumber: updated.ticketNumber,
    officeId: updated.officeId,
    officeName: office[0]?.name ?? "",
    serviceId: updated.serviceId,
    serviceName: service[0]?.nameFr ?? "",
    citizenName: updated.citizenName,
    citizenPhone: updated.citizenPhone,
    citizenNationalId: updated.citizenNationalId,
    date: updated.date,
    time: updated.time,
    status: updated.status,
    queuePosition: updated.queuePosition,
    estimatedWaitMinutes: 0,
    createdAt: updated.createdAt.toISOString(),
    calledAt: updated.calledAt?.toISOString(),
    completedAt: updated.completedAt?.toISOString(),
  });
});

router.get("/admin/stats", async (req, res) => {
  const officeId = req.query.officeId ? parseInt(req.query.officeId as string) : undefined;
  const date = (req.query.date as string) ?? new Date().toISOString().split("T")[0];

  const baseWhere = and(
    eq(appointmentsTable.date, date),
    officeId ? eq(appointmentsTable.officeId, officeId) : undefined
  );

  const [total] = await db.select({ count: sql<number>`count(*)::int` }).from(appointmentsTable).where(baseWhere);
  const [completed] = await db.select({ count: sql<number>`count(*)::int` }).from(appointmentsTable)
    .where(and(baseWhere, eq(appointmentsTable.status, "completed")));
  const [waiting] = await db.select({ count: sql<number>`count(*)::int` }).from(appointmentsTable)
    .where(and(baseWhere, sql`status IN ('pending', 'confirmed')`));
  const [noShow] = await db.select({ count: sql<number>`count(*)::int` }).from(appointmentsTable)
    .where(and(baseWhere, eq(appointmentsTable.status, "no_show")));

  const byHourRows = await db.select({
    hour: sql<string>`EXTRACT(HOUR FROM CAST(time AS TIME))::int::text`,
    count: sql<number>`count(*)::int`,
  }).from(appointmentsTable).where(baseWhere).groupBy(sql`EXTRACT(HOUR FROM CAST(time AS TIME))`).orderBy(sql`1`);

  const byServiceRows = await db.select({
    serviceName: officeServicesTable.nameFr,
    count: sql<number>`count(*)::int`,
  }).from(appointmentsTable)
    .leftJoin(officeServicesTable, eq(appointmentsTable.serviceId, officeServicesTable.id))
    .where(baseWhere)
    .groupBy(officeServicesTable.nameFr)
    .orderBy(sql`2 DESC`);

  const peakHour = byHourRows.sort((a, b) => b.count - a.count)[0]?.hour ?? "09";

  res.json({
    totalToday: total?.count ?? 0,
    completedToday: completed?.count ?? 0,
    waitingNow: waiting?.count ?? 0,
    noShowToday: noShow?.count ?? 0,
    averageWaitMinutes: 15,
    peakHour: `${peakHour.padStart(2, "0")}:00`,
    appointmentsByHour: byHourRows.map(r => ({ hour: `${r.hour.padStart(2, "0")}:00`, count: r.count })),
    appointmentsByService: byServiceRows.map(r => ({ serviceName: r.serviceName ?? "Inconnu", count: r.count })),
  });
});

export default router;

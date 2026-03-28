import { Router } from "express";
import { db } from "@workspace/db";
import { appointmentsTable, officesTable } from "@workspace/db/schema";
import { eq, and, sql } from "drizzle-orm";

const router = Router();

router.get("/queues/:officeId/status", async (req, res) => {
  const officeId = parseInt(req.params.officeId);
  if (isNaN(officeId)) {
    res.status(400).json({ error: "bad_request", message: "Invalid officeId" });
    return;
  }

  const officeRows = await db.select({ name: officesTable.name }).from(officesTable).where(eq(officesTable.id, officeId));
  if (officeRows.length === 0) {
    res.status(404).json({ error: "not_found", message: "Office not found" });
    return;
  }

  const today = new Date().toISOString().split("T")[0];

  const called = await db.select().from(appointmentsTable)
    .where(and(
      eq(appointmentsTable.officeId, officeId),
      eq(appointmentsTable.date, today),
      sql`status IN ('called', 'in_progress')`
    ))
    .orderBy(sql`called_at DESC`)
    .limit(1);

  const waiting = await db.select({ count: sql<number>`count(*)::int` })
    .from(appointmentsTable)
    .where(and(
      eq(appointmentsTable.officeId, officeId),
      eq(appointmentsTable.date, today),
      sql`status IN ('pending', 'confirmed')`
    ));

  const completed = await db.select({ count: sql<number>`count(*)::int` })
    .from(appointmentsTable)
    .where(and(
      eq(appointmentsTable.officeId, officeId),
      eq(appointmentsTable.date, today),
      eq(appointmentsTable.status, "completed")
    ));

  const current = called[0];
  const now = new Date();
  const hour = now.getHours();
  const isOpen = hour >= 8 && hour < 16;

  res.json({
    officeId,
    officeName: officeRows[0].name,
    currentTicket: current?.ticketNumber ?? "---",
    currentNumber: current?.queuePosition ?? 0,
    waitingCount: waiting[0]?.count ?? 0,
    completedToday: completed[0]?.count ?? 0,
    averageWaitMinutes: 15,
    isOpen,
    lastUpdated: new Date().toISOString(),
  });
});

router.get("/queues/:officeId/my-position", async (req, res) => {
  const officeId = parseInt(req.params.officeId);
  const appointmentId = parseInt(req.query.appointmentId as string);

  if (isNaN(officeId) || isNaN(appointmentId)) {
    res.status(400).json({ error: "bad_request", message: "Invalid params" });
    return;
  }

  const appts = await db.select().from(appointmentsTable).where(eq(appointmentsTable.id, appointmentId));
  if (appts.length === 0) {
    res.status(404).json({ error: "not_found", message: "Appointment not found" });
    return;
  }

  const appt = appts[0];
  const before = await db.select({ count: sql<number>`count(*)::int` })
    .from(appointmentsTable)
    .where(and(
      eq(appointmentsTable.officeId, officeId),
      eq(appointmentsTable.date, appt.date),
      sql`status IN ('pending', 'confirmed')`,
      sql`queue_position < ${appt.queuePosition}`
    ));

  const position = (before[0]?.count ?? 0) + 1;

  res.json({
    appointmentId,
    ticketNumber: appt.ticketNumber,
    position,
    estimatedWaitMinutes: position * 15,
    status: appt.status,
  });
});

export default router;

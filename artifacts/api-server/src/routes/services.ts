import { Router } from "express";
import { db } from "@workspace/db";
import { serviceCategoriesTable, officesTable, officeServicesTable, wilayasTable } from "@workspace/db/schema";
import { eq, and, ilike, sql } from "drizzle-orm";
import { appointmentsTable } from "@workspace/db/schema";

const router = Router();

router.get("/service-categories", async (_req, res) => {
  const cats = await db.select().from(serviceCategoriesTable).orderBy(serviceCategoriesTable.id);
  res.json(cats.map(c => ({
    id: c.id,
    nameAr: c.nameAr,
    nameFr: c.nameFr,
    nameEn: c.nameEn,
    icon: c.icon,
    description: c.description,
    color: c.color,
  })));
});

router.get("/offices", async (req, res) => {
  const { wilayaId, categoryId, search } = req.query;

  const offices = await db.select({
    id: officesTable.id,
    name: officesTable.name,
    nameAr: officesTable.nameAr,
    categoryId: officesTable.categoryId,
    categoryName: serviceCategoriesTable.nameFr,
    wilayaId: officesTable.wilayaId,
    wilayaName: wilayasTable.nameFr,
    address: officesTable.address,
    phone: officesTable.phone,
    openTime: officesTable.openTime,
    closeTime: officesTable.closeTime,
    workingDays: officesTable.workingDays,
    rating: officesTable.rating,
  }).from(officesTable)
    .leftJoin(serviceCategoriesTable, eq(officesTable.categoryId, serviceCategoriesTable.id))
    .leftJoin(wilayasTable, eq(officesTable.wilayaId, wilayasTable.id))
    .where(and(
      wilayaId ? eq(officesTable.wilayaId, parseInt(wilayaId as string)) : undefined,
      categoryId ? eq(officesTable.categoryId, parseInt(categoryId as string)) : undefined,
      search ? ilike(officesTable.name, `%${search}%`) : undefined,
    ))
    .orderBy(officesTable.name);

  const today = new Date().toISOString().split("T")[0];
  const enriched = await Promise.all(offices.map(async (o) => {
    const queueCount = await db.select({ count: sql<number>`count(*)::int` })
      .from(appointmentsTable)
      .where(and(
        eq(appointmentsTable.officeId, o.id),
        eq(appointmentsTable.date, today),
        sql`status NOT IN ('cancelled', 'completed', 'no_show')`
      ));
    const avgWait = 15;
    return {
      ...o,
      todayQueueCount: queueCount[0]?.count ?? 0,
      averageWaitMinutes: avgWait,
    };
  }));

  res.json(enriched);
});

router.get("/offices/:officeId", async (req, res) => {
  const officeId = parseInt(req.params.officeId);
  if (isNaN(officeId)) {
    res.status(400).json({ error: "bad_request", message: "Invalid officeId" });
    return;
  }

  const officeRows = await db.select({
    id: officesTable.id,
    name: officesTable.name,
    nameAr: officesTable.nameAr,
    categoryId: officesTable.categoryId,
    categoryName: serviceCategoriesTable.nameFr,
    wilayaId: officesTable.wilayaId,
    wilayaName: wilayasTable.nameFr,
    address: officesTable.address,
    phone: officesTable.phone,
    openTime: officesTable.openTime,
    closeTime: officesTable.closeTime,
    workingDays: officesTable.workingDays,
    rating: officesTable.rating,
    description: officesTable.description,
  }).from(officesTable)
    .leftJoin(serviceCategoriesTable, eq(officesTable.categoryId, serviceCategoriesTable.id))
    .leftJoin(wilayasTable, eq(officesTable.wilayaId, wilayasTable.id))
    .where(eq(officesTable.id, officeId));

  if (officeRows.length === 0) {
    res.status(404).json({ error: "not_found", message: "Office not found" });
    return;
  }

  const office = officeRows[0];
  const services = await db.select().from(officeServicesTable).where(eq(officeServicesTable.officeId, officeId));

  const today = new Date().toISOString().split("T")[0];
  const queueCount = await db.select({ count: sql<number>`count(*)::int` })
    .from(appointmentsTable)
    .where(and(eq(appointmentsTable.officeId, officeId), eq(appointmentsTable.date, today)));

  res.json({
    ...office,
    commune: "",
    todayQueueCount: queueCount[0]?.count ?? 0,
    averageWaitMinutes: 15,
    services: services.map(s => ({
      id: s.id,
      officeId: s.officeId,
      nameAr: s.nameAr,
      nameFr: s.nameFr,
      duration: s.duration,
      requiredDocuments: s.requiredDocuments ?? [],
      fee: s.fee,
    })),
  });
});

router.get("/offices/:officeId/services", async (req, res) => {
  const officeId = parseInt(req.params.officeId);
  if (isNaN(officeId)) {
    res.status(400).json({ error: "bad_request", message: "Invalid officeId" });
    return;
  }
  const services = await db.select().from(officeServicesTable).where(eq(officeServicesTable.officeId, officeId));
  res.json(services.map(s => ({
    id: s.id,
    officeId: s.officeId,
    nameAr: s.nameAr,
    nameFr: s.nameFr,
    duration: s.duration,
    requiredDocuments: s.requiredDocuments ?? [],
    fee: s.fee,
  })));
});

router.get("/offices/:officeId/available-slots", async (req, res) => {
  const officeId = parseInt(req.params.officeId);
  const { date } = req.query;
  if (isNaN(officeId) || !date) {
    res.status(400).json({ error: "bad_request", message: "Invalid params" });
    return;
  }

  const officeRows = await db.select().from(officesTable).where(eq(officesTable.id, officeId));
  if (officeRows.length === 0) {
    res.status(404).json({ error: "not_found", message: "Office not found" });
    return;
  }

  const office = officeRows[0];
  const [openH, openM] = office.openTime.split(":").map(Number);
  const [closeH] = office.closeTime.split(":").map(Number);

  const slots: Array<{ time: string; available: boolean; remainingCapacity: number }> = [];
  for (let h = openH; h < closeH; h++) {
    for (const m of [0, 30]) {
      if (h === openH && m < openM) continue;
      const timeStr = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      const existing = await db.select({ count: sql<number>`count(*)::int` })
        .from(appointmentsTable)
        .where(and(
          eq(appointmentsTable.officeId, officeId),
          eq(appointmentsTable.date, date as string),
          eq(appointmentsTable.time, timeStr),
          sql`status NOT IN ('cancelled', 'no_show')`
        ));
      const booked = existing[0]?.count ?? 0;
      const capacity = 3;
      const remaining = Math.max(0, capacity - booked);
      slots.push({ time: timeStr, available: remaining > 0, remainingCapacity: remaining });
    }
  }

  res.json(slots);
});

export default router;

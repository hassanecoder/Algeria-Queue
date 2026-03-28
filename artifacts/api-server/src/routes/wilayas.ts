import { Router } from "express";
import { db } from "@workspace/db";
import { wilayasTable, communesTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/wilayas", async (_req, res) => {
  const wilayas = await db.select().from(wilayasTable).orderBy(wilayasTable.id);
  res.json(wilayas.map(w => ({
    id: w.id,
    code: w.code,
    nameAr: w.nameAr,
    nameFr: w.nameFr,
    region: w.region,
  })));
});

router.get("/wilayas/:wilayaId/communes", async (req, res) => {
  const wilayaId = parseInt(req.params.wilayaId);
  if (isNaN(wilayaId)) {
    res.status(400).json({ error: "bad_request", message: "Invalid wilayaId" });
    return;
  }
  const communes = await db.select().from(communesTable).where(eq(communesTable.wilayaId, wilayaId)).orderBy(communesTable.nameFr);
  res.json(communes.map(c => ({
    id: c.id,
    wilayaId: c.wilayaId,
    nameAr: c.nameAr,
    nameFr: c.nameFr,
  })));
});

export default router;

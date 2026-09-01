import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { HttpError } from "../middleware/error.middleware";

const treatmentSchema = z.object({
  name: z.string().min(2),
  durationMinutes: z.number().int().positive(),
  price: z.number().nonnegative(),
  active: z.boolean().optional(),
});

export async function listTreatments(req: Request, res: Response) {
  const activeOnly = req.query.active === "true";

  const treatments = await prisma.treatment.findMany({
    where: activeOnly ? { active: true } : undefined,
    orderBy: { name: "asc" },
  });

  res.json(treatments);
}

export async function getTreatment(req: Request, res: Response) {
  const treatment = await prisma.treatment.findUnique({ where: { id: req.params.id } });
  if (!treatment) {
    throw new HttpError(404, "Treatment not found");
  }
  res.json(treatment);
}

export async function createTreatment(req: Request, res: Response) {
  const body = treatmentSchema.parse(req.body);
  const treatment = await prisma.treatment.create({ data: body });
  res.status(201).json(treatment);
}

export async function updateTreatment(req: Request, res: Response) {
  const body = treatmentSchema.partial().parse(req.body);

  const exists = await prisma.treatment.findUnique({ where: { id: req.params.id } });
  if (!exists) {
    throw new HttpError(404, "Treatment not found");
  }

  const treatment = await prisma.treatment.update({ where: { id: req.params.id }, data: body });
  res.json(treatment);
}

export async function deleteTreatment(req: Request, res: Response) {
  const exists = await prisma.treatment.findUnique({ where: { id: req.params.id } });
  if (!exists) {
    throw new HttpError(404, "Treatment not found");
  }

  await prisma.treatment.delete({ where: { id: req.params.id } });
  res.status(204).send();
}

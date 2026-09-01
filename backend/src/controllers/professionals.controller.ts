import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { HttpError } from "../middleware/error.middleware";

const professionalSchema = z.object({
  name: z.string().min(2),
  specialty: z.string().optional().nullable(),
  active: z.boolean().optional(),
});

export async function listProfessionals(req: Request, res: Response) {
  const activeOnly = req.query.active === "true";

  const professionals = await prisma.professional.findMany({
    where: activeOnly ? { active: true } : undefined,
    orderBy: { name: "asc" },
  });

  res.json(professionals);
}

export async function getProfessional(req: Request, res: Response) {
  const professional = await prisma.professional.findUnique({ where: { id: req.params.id } });
  if (!professional) {
    throw new HttpError(404, "Professional not found");
  }
  res.json(professional);
}

export async function createProfessional(req: Request, res: Response) {
  const body = professionalSchema.parse(req.body);
  const professional = await prisma.professional.create({ data: body });
  res.status(201).json(professional);
}

export async function updateProfessional(req: Request, res: Response) {
  const body = professionalSchema.partial().parse(req.body);

  const exists = await prisma.professional.findUnique({ where: { id: req.params.id } });
  if (!exists) {
    throw new HttpError(404, "Professional not found");
  }

  const professional = await prisma.professional.update({ where: { id: req.params.id }, data: body });
  res.json(professional);
}

export async function deleteProfessional(req: Request, res: Response) {
  const exists = await prisma.professional.findUnique({ where: { id: req.params.id } });
  if (!exists) {
    throw new HttpError(404, "Professional not found");
  }

  await prisma.professional.delete({ where: { id: req.params.id } });
  res.status(204).send();
}

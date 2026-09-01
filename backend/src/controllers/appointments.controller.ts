import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { HttpError } from "../middleware/error.middleware";

const appointmentInclude = {
  client: { select: { id: true, name: true, phone: true } },
  professional: { select: { id: true, name: true } },
  treatment: { select: { id: true, name: true, durationMinutes: true, price: true } },
} as const;

const statusValues = ["PENDING", "CONFIRMED", "CANCELED", "COMPLETED", "NO_SHOW"] as const;

const createSchema = z.object({
  clientId: z.string().uuid(),
  professionalId: z.string().uuid(),
  treatmentId: z.string().uuid(),
  startsAt: z.coerce.date(),
  room: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  status: z.enum(statusValues).optional(),
});

const updateSchema = createSchema.partial();

async function assertNoConflict(params: {
  professionalId: string;
  startsAt: Date;
  endsAt: Date;
  excludeId?: string;
}) {
  const conflict = await prisma.appointment.findFirst({
    where: {
      professionalId: params.professionalId,
      status: { not: "CANCELED" },
      startsAt: { lt: params.endsAt },
      endsAt: { gt: params.startsAt },
      ...(params.excludeId ? { id: { not: params.excludeId } } : {}),
    },
  });

  if (conflict) {
    throw new HttpError(409, "This professional already has an appointment in this time range");
  }
}

export async function listAppointments(req: Request, res: Response) {
  const { professionalId, clientId, status, from, to } = req.query;

  const where: Record<string, unknown> = {};
  if (typeof professionalId === "string") where.professionalId = professionalId;
  if (typeof clientId === "string") where.clientId = clientId;
  if (typeof status === "string") where.status = status;
  if (typeof from === "string" || typeof to === "string") {
    where.startsAt = {
      ...(typeof from === "string" ? { gte: new Date(from) } : {}),
      ...(typeof to === "string" ? { lte: new Date(to) } : {}),
    };
  }

  const appointments = await prisma.appointment.findMany({
    where,
    include: appointmentInclude,
    orderBy: { startsAt: "asc" },
  });

  res.json(appointments);
}

export async function getAppointment(req: Request, res: Response) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: req.params.id },
    include: appointmentInclude,
  });
  if (!appointment) {
    throw new HttpError(404, "Appointment not found");
  }
  res.json(appointment);
}

export async function createAppointment(req: Request, res: Response) {
  const body = createSchema.parse(req.body);

  const [client, professional, treatment] = await Promise.all([
    prisma.client.findUnique({ where: { id: body.clientId } }),
    prisma.professional.findUnique({ where: { id: body.professionalId } }),
    prisma.treatment.findUnique({ where: { id: body.treatmentId } }),
  ]);

  if (!client) throw new HttpError(404, "Client not found");
  if (!professional) throw new HttpError(404, "Professional not found");
  if (!treatment) throw new HttpError(404, "Treatment not found");

  const endsAt = new Date(body.startsAt.getTime() + treatment.durationMinutes * 60_000);

  await assertNoConflict({ professionalId: body.professionalId, startsAt: body.startsAt, endsAt });

  const appointment = await prisma.appointment.create({
    data: {
      clientId: body.clientId,
      professionalId: body.professionalId,
      treatmentId: body.treatmentId,
      startsAt: body.startsAt,
      endsAt,
      room: body.room ?? undefined,
      notes: body.notes ?? undefined,
      status: body.status ?? "PENDING",
    },
    include: appointmentInclude,
  });

  res.status(201).json(appointment);
}

export async function updateAppointment(req: Request, res: Response) {
  const body = updateSchema.parse(req.body);

  const existing = await prisma.appointment.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    throw new HttpError(404, "Appointment not found");
  }

  const professionalId = body.professionalId ?? existing.professionalId;
  const startsAt = body.startsAt ?? existing.startsAt;
  const treatmentId = body.treatmentId ?? existing.treatmentId;

  let endsAt = existing.endsAt;
  if (body.startsAt || body.treatmentId) {
    const treatment = await prisma.treatment.findUnique({ where: { id: treatmentId } });
    if (!treatment) throw new HttpError(404, "Treatment not found");
    endsAt = new Date(startsAt.getTime() + treatment.durationMinutes * 60_000);
  }

  if (body.startsAt || body.treatmentId || body.professionalId) {
    await assertNoConflict({ professionalId, startsAt, endsAt, excludeId: existing.id });
  }

  const appointment = await prisma.appointment.update({
    where: { id: existing.id },
    data: {
      clientId: body.clientId,
      professionalId: body.professionalId,
      treatmentId: body.treatmentId,
      startsAt: body.startsAt,
      endsAt: body.startsAt || body.treatmentId ? endsAt : undefined,
      room: body.room,
      notes: body.notes,
      status: body.status,
    },
    include: appointmentInclude,
  });

  res.json(appointment);
}

export async function deleteAppointment(req: Request, res: Response) {
  const exists = await prisma.appointment.findUnique({ where: { id: req.params.id } });
  if (!exists) {
    throw new HttpError(404, "Appointment not found");
  }

  await prisma.appointment.delete({ where: { id: req.params.id } });
  res.status(204).send();
}

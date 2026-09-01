import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfNextMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

export async function getDashboardSummary(_req: Request, res: Response) {
  const now = new Date();

  const [totalClients, appointmentsToday, completedThisMonth, upcomingAppointments] = await Promise.all([
    prisma.client.count(),
    prisma.appointment.count({
      where: {
        startsAt: { gte: startOfDay(now), lte: endOfDay(now) },
        status: { not: "CANCELED" },
      },
    }),
    prisma.appointment.findMany({
      where: {
        status: "COMPLETED",
        startsAt: { gte: startOfMonth(now), lt: startOfNextMonth(now) },
      },
      include: { treatment: { select: { price: true } } },
    }),
    prisma.appointment.findMany({
      where: {
        startsAt: { gte: now },
        status: { not: "CANCELED" },
      },
      orderBy: { startsAt: "asc" },
      take: 5,
      include: {
        client: { select: { id: true, name: true } },
        professional: { select: { id: true, name: true } },
        treatment: { select: { id: true, name: true } },
      },
    }),
  ]);

  const revenueThisMonth = completedThisMonth.reduce((sum, a) => sum + a.treatment.price, 0);

  res.json({
    totalClients,
    appointmentsToday,
    revenueThisMonth,
    upcomingAppointments,
  });
}

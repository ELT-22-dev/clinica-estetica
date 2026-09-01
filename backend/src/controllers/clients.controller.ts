import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { HttpError } from "../middleware/error.middleware";

const clientSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(1).optional().nullable(),
  email: z.string().email().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export async function listClients(req: Request, res: Response) {
  const search = typeof req.query.search === "string" ? req.query.search : undefined;

  const clients = await prisma.client.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { name: "asc" },
  });

  res.json(clients);
}

export async function getClient(req: Request, res: Response) {
  const client = await prisma.client.findUnique({ where: { id: req.params.id } });
  if (!client) {
    throw new HttpError(404, "Client not found");
  }
  res.json(client);
}

export async function createClient(req: Request, res: Response) {
  const body = clientSchema.parse(req.body);
  const client = await prisma.client.create({ data: body });
  res.status(201).json(client);
}

export async function updateClient(req: Request, res: Response) {
  const body = clientSchema.partial().parse(req.body);

  const exists = await prisma.client.findUnique({ where: { id: req.params.id } });
  if (!exists) {
    throw new HttpError(404, "Client not found");
  }

  const client = await prisma.client.update({ where: { id: req.params.id }, data: body });
  res.json(client);
}

export async function deleteClient(req: Request, res: Response) {
  const exists = await prisma.client.findUnique({ where: { id: req.params.id } });
  if (!exists) {
    throw new HttpError(404, "Client not found");
  }

  await prisma.client.delete({ where: { id: req.params.id } });
  res.status(204).send();
}

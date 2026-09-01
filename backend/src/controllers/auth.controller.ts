import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env";
import { prisma } from "../lib/prisma";
import { HttpError } from "../middleware/error.middleware";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function signToken(userId: string, role: string) {
  return jwt.sign({ sub: userId, role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn } as jwt.SignOptions);
}

export async function register(req: Request, res: Response) {
  const body = registerSchema.parse(req.body);

  const existing = await prisma.user.findUnique({ where: { email: body.email } });
  if (existing) {
    throw new HttpError(409, "Email already registered");
  }

  const passwordHash = await bcrypt.hash(body.password, 10);
  const user = await prisma.user.create({
    data: { name: body.name, email: body.email, passwordHash },
  });

  const token = signToken(user.id, user.role);
  res.status(201).json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
}

export async function login(req: Request, res: Response) {
  const body = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email: body.email } });
  if (!user) {
    throw new HttpError(401, "Invalid credentials");
  }

  const valid = await bcrypt.compare(body.password, user.passwordHash);
  if (!valid) {
    throw new HttpError(401, "Invalid credentials");
  }

  const token = signToken(user.id, user.role);
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
}

export async function me(req: Request, res: Response) {
  const user = await prisma.user.findUnique({ where: { id: req.user!.sub } });
  if (!user) {
    throw new HttpError(404, "User not found");
  }
  res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
}

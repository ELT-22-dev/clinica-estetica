import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { HttpError } from "./error.middleware";

export interface AuthPayload {
  sub: string;
  role: "ADMIN" | "PROFESSIONAL";
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw new HttpError(401, "Missing bearer token");
  }

  const token = header.slice("Bearer ".length);
  try {
    req.user = jwt.verify(token, env.jwtSecret) as AuthPayload;
    next();
  } catch {
    throw new HttpError(401, "Invalid or expired token");
  }
}

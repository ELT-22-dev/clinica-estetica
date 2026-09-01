import { Router } from "express";
import { login, me, register } from "../controllers/auth.controller";
import { asyncHandler } from "../lib/async-handler";
import { requireAuth, requireRole } from "../middleware/auth.middleware";
import { rateLimit } from "../middleware/rate-limit.middleware";

export const authRouter = Router();

// Brute-force / credential-stuffing guard on the sensitive auth endpoints.
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });

// Registration creates ADMIN users by default (see prisma schema), so it must
// never be public — only an already-authenticated admin may provision new accounts.
authRouter.post("/register", authLimiter, requireAuth, requireRole("ADMIN"), asyncHandler(register));
authRouter.post("/login", authLimiter, asyncHandler(login));
authRouter.get("/me", requireAuth, asyncHandler(me));

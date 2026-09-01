import { Router } from "express";
import { getDashboardSummary } from "../controllers/dashboard.controller";
import { asyncHandler } from "../lib/async-handler";
import { requireAuth } from "../middleware/auth.middleware";

export const dashboardRouter = Router();

dashboardRouter.use(requireAuth);
dashboardRouter.get("/summary", asyncHandler(getDashboardSummary));

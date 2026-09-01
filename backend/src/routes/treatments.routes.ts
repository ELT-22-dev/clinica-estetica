import { Router } from "express";
import {
  createTreatment,
  deleteTreatment,
  getTreatment,
  listTreatments,
  updateTreatment,
} from "../controllers/treatments.controller";
import { asyncHandler } from "../lib/async-handler";
import { requireAuth } from "../middleware/auth.middleware";

export const treatmentsRouter = Router();

treatmentsRouter.use(requireAuth);
treatmentsRouter.get("/", asyncHandler(listTreatments));
treatmentsRouter.get("/:id", asyncHandler(getTreatment));
treatmentsRouter.post("/", asyncHandler(createTreatment));
treatmentsRouter.put("/:id", asyncHandler(updateTreatment));
treatmentsRouter.delete("/:id", asyncHandler(deleteTreatment));

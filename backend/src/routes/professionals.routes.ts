import { Router } from "express";
import {
  createProfessional,
  deleteProfessional,
  getProfessional,
  listProfessionals,
  updateProfessional,
} from "../controllers/professionals.controller";
import { asyncHandler } from "../lib/async-handler";
import { requireAuth } from "../middleware/auth.middleware";

export const professionalsRouter = Router();

professionalsRouter.use(requireAuth);
professionalsRouter.get("/", asyncHandler(listProfessionals));
professionalsRouter.get("/:id", asyncHandler(getProfessional));
professionalsRouter.post("/", asyncHandler(createProfessional));
professionalsRouter.put("/:id", asyncHandler(updateProfessional));
professionalsRouter.delete("/:id", asyncHandler(deleteProfessional));

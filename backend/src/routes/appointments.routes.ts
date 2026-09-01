import { Router } from "express";
import {
  createAppointment,
  deleteAppointment,
  getAppointment,
  listAppointments,
  updateAppointment,
} from "../controllers/appointments.controller";
import { asyncHandler } from "../lib/async-handler";
import { requireAuth } from "../middleware/auth.middleware";

export const appointmentsRouter = Router();

appointmentsRouter.use(requireAuth);
appointmentsRouter.get("/", asyncHandler(listAppointments));
appointmentsRouter.get("/:id", asyncHandler(getAppointment));
appointmentsRouter.post("/", asyncHandler(createAppointment));
appointmentsRouter.put("/:id", asyncHandler(updateAppointment));
appointmentsRouter.delete("/:id", asyncHandler(deleteAppointment));

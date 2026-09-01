import { Router } from "express";
import {
  createClient,
  deleteClient,
  getClient,
  listClients,
  updateClient,
} from "../controllers/clients.controller";
import { asyncHandler } from "../lib/async-handler";
import { requireAuth } from "../middleware/auth.middleware";

export const clientsRouter = Router();

clientsRouter.use(requireAuth);
clientsRouter.get("/", asyncHandler(listClients));
clientsRouter.get("/:id", asyncHandler(getClient));
clientsRouter.post("/", asyncHandler(createClient));
clientsRouter.put("/:id", asyncHandler(updateClient));
clientsRouter.delete("/:id", asyncHandler(deleteClient));

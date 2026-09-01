import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import { rateLimit } from "./middleware/rate-limit.middleware";
import { appointmentsRouter } from "./routes/appointments.routes";
import { authRouter } from "./routes/auth.routes";
import { clientsRouter } from "./routes/clients.routes";
import { dashboardRouter } from "./routes/dashboard.routes";
import { healthRouter } from "./routes/health.routes";
import { professionalsRouter } from "./routes/professionals.routes";
import { treatmentsRouter } from "./routes/treatments.routes";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json({ limit: "1mb" }));

  // Defense-in-depth: this API is publicly reachable as a portfolio demo,
  // so cap overall traffic per IP in addition to the stricter auth-route limits.
  app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

  app.use("/health", healthRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/clients", clientsRouter);
  app.use("/api/professionals", professionalsRouter);
  app.use("/api/treatments", treatmentsRouter);
  app.use("/api/appointments", appointmentsRouter);
  app.use("/api/dashboard", dashboardRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

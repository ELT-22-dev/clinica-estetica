import type { NextFunction, Request, Response } from "express";
import { HttpError } from "./error.middleware";

interface Bucket {
  count: number;
  resetAt: number;
}

/**
 * Minimal in-memory fixed-window limiter (no external dependency needed).
 * Good enough for a single-instance demo API; keyed by IP + route.
 */
export function rateLimit({ windowMs, max }: { windowMs: number; max: number }) {
  const buckets = new Map<string, Bucket>();

  return function rateLimiter(req: Request, _res: Response, next: NextFunction) {
    const key = `${req.ip}:${req.baseUrl}${req.path}`;
    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (bucket.count >= max) {
      throw new HttpError(429, "Too many requests, please try again later");
    }

    bucket.count += 1;
    next();
  };
}

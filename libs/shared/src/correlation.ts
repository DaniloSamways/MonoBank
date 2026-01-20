import { AsyncLocalStorage } from "node:async_hooks";
import { Request, Response, NextFunction } from "express";
import { randomUUID } from "node:crypto";

type Store = { correlationId: string };
const als = new AsyncLocalStorage<Store>();

export function getCorrelationId(): string | undefined {
  return als.getStore()?.correlationId;
}

export function correlationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const incoming = req.header("x-correlation-id");
  const correlationId =
    incoming && incoming.length > 0 ? incoming : randomUUID();

  res.setHeader("x-correlation-id", correlationId);

  als.run({ correlationId }, () => next());
}

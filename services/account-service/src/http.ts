import express from "express";
import { correlationMiddleware, logger } from "@monobank/shared";
import accountRouter from "./routes/account.router";
import helmet from "helmet";
import cors from "cors";

export function startHttpServer() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || "*",
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(correlationMiddleware);

  app.use("/api/v1/account", accountRouter);

  const port = Number(process.env.PORT ?? 3002);
  app.listen(port, () => {
    logger.info({ port }, "account-service started");
  });
}

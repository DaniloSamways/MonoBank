import express from "express";
import { correlationMiddleware, logger } from "@monobank/shared";
import authRouter from "./auth.router";

const app = express();
app.use(express.json());
app.use(correlationMiddleware);

app.use("/api/v1/auth", authRouter);

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => {
  logger.info({ port }, "auth-service started");
});

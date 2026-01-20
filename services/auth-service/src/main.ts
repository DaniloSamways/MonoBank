import express from "express";
import {
  correlationMiddleware,
  getCorrelationId,
  logger,
} from "@monobank/shared";

const app = express();
app.use(express.json());
app.use(correlationMiddleware);

app.get("/health", (req, res) => {
  logger.info({ correlationId: getCorrelationId() }, "healthcheck");
  res.json({ status: "ok" });
});

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => {
  logger.info({ port }, "auth-service started");
});

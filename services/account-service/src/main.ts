import express from "express";
import { correlationMiddleware, logger } from "@monobank/shared";
import accountRouter from "./account.router";

const app = express();
app.use(express.json());
app.use(correlationMiddleware);

app.use("/api/v1/account", accountRouter);

const port = Number(process.env.PORT ?? 3002);
app.listen(port, () => {
  logger.info({ port }, "account-service started");
});

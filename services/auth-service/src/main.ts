import { logger } from "@monobank/shared";
import { startHttpServer } from "./http";

async function bootstrap() {
  startHttpServer();
}

bootstrap().catch((err) => {
  logger.error(err, "❌ Failed to start Auth Service");
  process.exit(1);
});

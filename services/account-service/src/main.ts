import { logger } from "@monobank/shared";
import { startUserConsumer } from "./consumers/user.consumer";
import { startHttpServer } from "./http";

async function bootstrap() {
  startHttpServer();
  await startUserConsumer();
}

bootstrap().catch((err) => {
  logger.error(err, "❌ Failed to start Account Service");
  process.exit(1);
});

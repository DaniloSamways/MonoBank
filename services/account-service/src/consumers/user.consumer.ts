import { logger } from "@monobank/shared";
import { kafka } from "../lib/kafka";

export async function startUserConsumer() {
  const consumer = kafka.consumer({
    groupId: "account-service-group",
  });

  await consumer.connect();
  await consumer.subscribe({
    topic: "user.updated",
    fromBeginning: true,
  });

  logger.info("user-consumer started");

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const event = JSON.parse(message.value!.toString());

      logger.info({ event }, `Received on ${topic}`);
    },
  });
}

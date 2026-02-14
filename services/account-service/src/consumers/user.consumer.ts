import { logger } from "@monobank/shared";
import { kafka } from "../lib/kafka";
import { AccountService } from "../account.service";
import { AccountRepository } from "../account.repository";

const repositoryService = new AccountRepository();
const accountService = new AccountService(repositoryService);

export async function startUserConsumer() {
  const consumer = kafka.consumer({
    groupId: "account-service-group",
  });

  await consumer.connect();
  await consumer.subscribe({
    topic: "user.created",
    fromBeginning: true,
  });

  logger.info("user-consumer started");

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const event = JSON.parse(message.value!.toString());
      const userData = event.data;

      logger.info({ event }, `Received on ${topic}`);

      const account = await accountService.create({
        userId: userData.id,
        type: "PF",
      });

      logger.info(
        { account },
        `Account created on ${topic} - ${event.event_id}`,
      );
    },
  });
}

import { Kafka, logLevel } from "kafkajs";

export const kafka = new Kafka({
  clientId: "account-service",
  brokers: [process.env.KAFKA_BROKERS ?? "localhost:9092"],
  logLevel: logLevel.INFO,
});

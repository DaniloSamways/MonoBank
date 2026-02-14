import { DataSource } from "typeorm";
import { Account } from "../src/entities/account.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.ACCOUNT_DB_HOST!,
  port: Number(process.env.ACCOUNT_DB_PORT!),
  username: process.env.ACCOUNT_DB_USER!,
  password: process.env.ACCOUNT_DB_PASS!,
  database: process.env.ACCOUNT_DB_NAME!,
  entities: [Account],
  synchronize: true,
  logging: false,
});

try {
  AppDataSource.initialize();
} catch (error) {
  console.log(error);
}

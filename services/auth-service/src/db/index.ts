import { DataSource } from "typeorm";
import { User } from "../entities/user.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.AUTH_DB_HOST!,
  port: Number(process.env.AUTH_DB_PORT!),
  username: process.env.AUTH_DB_USER!,
  password: process.env.AUTH_DB_PASS!,
  database: process.env.AUTH_DB_NAME!,
  entities: [User],
  synchronize: true,
  logging: false,
});

try {
  AppDataSource.initialize();
} catch (error) {
  console.log(error);
}

import "reflect-metadata";
import { DataSource } from "typeorm";
import { getEnv } from "./env";

export const AppDataSource = new DataSource({
  type: getEnv("DB_DIALECT") as any,
  host: getEnv("DB_HOST"),
  port: Number(getEnv("DB_PORT")),
  username: getEnv("DB_USER"),
  password: getEnv("DB_PASS"),
  database: getEnv("DB_NAME"),
  synchronize: false,
  logging: false,
  entities: ["src/entities/**/*.ts"],
  migrations: ["src/migrations/**/*.ts"],
  subscribers: [],
});

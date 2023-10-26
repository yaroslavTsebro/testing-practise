import { DataSource } from "typeorm";
import { User } from "./model/user";

export const db = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "root",
  password: "admin",
  database: "test",
  entities: [User],
  synchronize: true,
}).initialize();
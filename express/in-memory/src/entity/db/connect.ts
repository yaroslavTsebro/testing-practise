import { DataSource, createConnection } from "typeorm";
import { User } from "./model/user";

export const myDataSource = createConnection({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "zsbldqpk56",
  database: "test",
  entities: ["src/entity/db/model/*.ts"],
  logging: true,
  synchronize: true,
});

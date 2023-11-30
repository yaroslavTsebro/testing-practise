import { createConnection } from "typeorm";
import { User } from "../../../src/entity/db/model/user";

const myDataSource = createConnection({
  type: "better-sqlite3",
  database: ":memory:",
  entities: [User],
  logging: true,
  synchronize: true,
});

export default function connectToDB() {
  myDataSource
    .then(() => {
      console.log("Data Source has been initialized!");
    })
    .catch((err) => {
      console.error("Error during Data Source initialization:", err);
      process.exit(1);
    });
}
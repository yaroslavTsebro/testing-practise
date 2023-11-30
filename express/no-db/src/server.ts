import cookieParser from "cookie-parser";
import { createServer, Server as HttpServer } from "http";
import "reflect-metadata";
import { errorHandlerMiddleware } from "./middleware/error-handler-middleware";

import cors from "cors";
import express, { Application } from "express";
import { config } from "./config/config";
import { myDataSource } from "./entity/db/connect";
import { mainRouter } from "./router";

export class Server {
  private readonly PORT: number;
  private readonly app: Application;
  private readonly httpServer: HttpServer;

  constructor() {
    this.PORT = config.server.port;
    this.connectToDB();
    this.app = express();
    this.configureServer();
    this.httpServer = createServer(this.app);
  }

  private connectToDB() {
    myDataSource
      .then(() => {
        console.log("Data Source has been initialized!");
      })
      .catch((err) => {
        console.error("Error during Data Source initialization:", err);
        process.exit(1);
      });
  }

  private configureServer() {
    const corsOptions = {
      origin: "*",
    };
    this.app.use(cors(corsOptions));
    this.app.use(cookieParser());
    this.app.use(express.json());

    this.app.use("/api", mainRouter);
    this.app.use(errorHandlerMiddleware);
  }

  public async start() {
    this.httpServer.listen(this.PORT, () => {
      const startUpMessage = `Server is working on ${this.PORT}`;
      console.log(startUpMessage);
    });
  }
}

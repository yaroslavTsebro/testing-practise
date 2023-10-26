import "reflect-metadata";
import { createServer, Server as HttpServer } from "http";
import cookieParser from "cookie-parser";
import { errorHandlerMiddleware } from "./middleware/error-handler-middleware";

import { config } from "./config/config";
import express, { Application } from "express";
import cors from "cors";
import { db } from "./entity/db/connect";
import { mainRouter } from "./router";

export class Server {
  private readonly PORT: number;
  private readonly app: Application;
  private readonly httpServer: HttpServer;

  constructor() {
    this.PORT = config.server.port;
    this.app = express();
    this.httpServer = createServer(this.app);
    this.configureServer();
  }

  private configureServer() {
    const corsOptions = {
      origin: "*",
    };
    db.then();
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

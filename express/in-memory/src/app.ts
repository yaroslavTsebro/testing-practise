import "reflect-metadata";
import { Server } from "./server";

function startApp() {
  const server = new Server();
  server
    .start()
    .then(() => {
      console.log(`Server started apply configurations`);
    })
    .catch((e) => {
      console.error(e, `Error happened during starting up`);
    });
}

startApp();

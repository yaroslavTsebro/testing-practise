import * as socket from 'socket.io';

export {};
declare global {
  namespace globalThis {
    // var is necessary here
    var io: socket.Server;
  }
}
declare module 'socket.io' {
  interface Socket {
    user: UserJWTData;
  }
}
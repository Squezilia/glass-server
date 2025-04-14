import {
  App,
  AppOptions,
  us_listen_socket,
  us_listen_socket_close,
} from "uWebSockets.js";
import Router from "./Router";

export default class Glass extends Router {
  options: AppOptions = {};
  host: string = "0.0.0.0";
  protected port?: number;
  protected socket?: us_listen_socket;

  constructor(options?: AppOptions) {
    const app = App(options || {});

    super(app);
  }

  protected initiateServer() {
    this.uws.any("/*", (res) => {
      res.cork(() => {
        res.writeStatus("404").end("404 Not Found");
      });
    });
  }

  listen = (port: number, host?: string) =>
    new Promise((resolve) => {
      this.port = port;
      this.host = host || this.host;
      this.uws.listen(this.host, this.port, (socket) => {
        this.socket = socket;
        this.initiateServer();
        this.initiateRouter();
        resolve(this.socket);
      });
    });

  shutdown() {
    if (!this.socket) return;
    us_listen_socket_close(this.socket);
  }

  close() {
    this.uws.close();
  }
}

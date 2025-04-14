import { HttpRequest, HttpResponse, TemplatedApp } from "uWebSockets.js";
import { UWSRequest } from "./Request";
import Response from "./Response";

type RouteHandler = (
  req: UWSRequest
) => Response | void | Promise<Response | void>;

type HTTPMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "OPTIONS"
  | "CONNECT"
  | "HEAD"
  | "TRACE";

interface RouteDetails {
  method: HTTPMethod;
  handlers: RouteHandler[];
}

export default class Router {
  routeMap: Record<string, RouteDetails> = {};
  protected uws: TemplatedApp;

  constructor(uws: TemplatedApp) {
    this.uws = uws;
  }

  get(path: string, ...handlers: RouteHandler[]) {
    this.routeMap[path] = {
      method: "GET",
      handlers,
    };
  }

  protected async polyfillToUwsHandler(
    res: HttpResponse,
    req: HttpRequest,
    handlers: RouteHandler[]
  ) {
    let polyfillRequest = new UWSRequest(req, res);
    for (let handler of handlers) {
      let polyfillResponse = await handler(polyfillRequest);
      if (polyfillResponse) break;
    }
  }

  initiateRouter() {
    for (let [path, details] of Object.entries(this.routeMap)) {
      switch (details.method) {
        case "GET":
          this.uws.get(path, (res, req) =>
            this.polyfillToUwsHandler(res, req, details.handlers)
          );
          break;

        default:
          break;
      }
    }
  }
}

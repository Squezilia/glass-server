import { HttpRequest, HttpResponse } from "uWebSockets.js";

export class UWSRequest {
  req: HttpRequest;
  res: HttpResponse;
  constructor(req: HttpRequest, res: HttpResponse) {
    this.req = req;
    this.res = res;
  }
}

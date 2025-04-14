import { OutgoingHttpHeaders } from "http2";
import { UWSRequest } from "./Request";

export default class Response {
  req: UWSRequest;
  status: number = 200;
  body: Buffer = Buffer.alloc(0);
  headers: OutgoingHttpHeaders = {};

  constructor(req: UWSRequest) {
    this.req = req;
  }

  protected initiateResponse() {
    this.req.res.cork(() => {
      for (let [key, val] of Object.entries(this.headers)) {
        if (val) this.req.res.writeHeader(key, val.toString());
      }

      this.req.res.writeStatus(this.status.toString());

      this.req.res.write(this.body);

      this.req.res.endWithoutBody(this.body.length);
    });
  }

  /**
   * Writes response to a JSON object and ends instance.
   * @param obj Response object
   */
  json(obj: object) {
    this.body = Buffer.from(JSON.stringify(obj));
    this.setHeader("content-type", "application/json");
    this.end();
  }

  /**
   * Writes a chunk to response body.
   * @param chunkRaw Writeable chunk of response
   * @returns Response instance
   */
  write(chunkRaw: Buffer | string) {
    let chunk = typeof chunkRaw == "string" ? Buffer.from(chunkRaw) : chunkRaw;
    this.body = Buffer.concat([this.body, chunk]);
    return this;
  }

  /**
   * Overwrites status of response.
   * @param status Http status of response
   * @returns Response instance
   */
  setStatus(status: number) {
    this.status = status;
    return this;
  }

  /**
   * Writes a header to response
   * @param header Key name of header
   * @param value Value pair of header key name
   * @returns Response instance
   */
  setHeader(
    header: keyof OutgoingHttpHeaders,
    value: OutgoingHttpHeaders[typeof header]
  ) {
    this.headers[header] = value;
    return this;
  }

  /**
   * Returns value of selected header.
   * @param header Key name of header
   * @returns Value of header
   */
  getHeader(header: keyof OutgoingHttpHeaders) {
    return this.headers[header];
  }

  end(chunk?: Buffer | string) {
    if (chunk) this.write(chunk);
    this.initiateResponse();
  }
}

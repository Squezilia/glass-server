import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import Glass from "./class/Glass";
import Response from "./class/Response";

let server: Glass | undefined;

beforeAll(async () => {
  server = new Glass();

  server.get("/hi", (req) => {
    let res = new Response(req);
    res.write("hellloooo!!");
    res.end();
    return res;
  });

  await server.listen(3003);
});

afterAll(() => {
  server?.close();
});

describe("initiate server", () => {
  test("get 404", async () => {
    let res = await fetch("http://0.0.0.0:3003");
    expect(res.status).toBe(404);
    expect((await res.text()).toString()).toBe("404 Not Found");
  });

  test("get /hi", async () => {
    let res = await fetch("http://0.0.0.0:3003/hi");
    expect(res.status).toBe(200);
    expect((await res.text()).toString()).toBe("hellloooo!!");
  });
});

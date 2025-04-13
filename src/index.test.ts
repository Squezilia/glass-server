import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import Glass from "./class/Glass";

let server: Glass | undefined;

beforeAll(async () => {
  server = new Glass();
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
});

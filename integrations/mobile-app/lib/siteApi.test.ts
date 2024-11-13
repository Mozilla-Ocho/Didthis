import { extractSessionCookie } from "./siteApi";

describe("extractSessionCookie", () => {
  it("extracts the session cookie when CSRF cookie set first", async () => {
    const expected =
      "1|appleid-867530.768758b845e645b5990bdacda2292b88.0006|1698857362|1698857362:26993e772846ff455960797be2b7670d18bec0bc09f1cc73f8d974a318675309";
    const headers = {
      connection: "keep-alive",
      "content-length": "356",
      "content-type": "application/json; charset=utf-8",
      date: "Wed, 01 Nov 2023 16:48:41 GMT",
      "set-cookie": `_h3y_csrf=8675309c-10db-40f1-a49c-2ce516ed3c95; path=/; samesite=lax, _h3y_sess=${expected}; path=/; expires=Mon, 29 Apr 2024 16:49:22 GMT; samesite=lax`,
      etag: `"o50rhqjm0v9w"`,
      "keep-alive": "timeout=5",
    };
    const mockResponse = {
      headers: {
        entries: jest.fn().mockReturnValue(Object.entries(headers)),
        get: jest.fn(name => headers[name]),
      },
    };
    const result = await extractSessionCookie(
      mockResponse as unknown as Response
    );
    expect(result).toEqual(expected);
  });
});

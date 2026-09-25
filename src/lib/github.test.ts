/**
 * @jest-environment node
 */
import { getPublicRepoCount } from "./github";

describe("getPublicRepoCount", () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    global.fetch = fetchMock;
    fetchMock.mockReset();
  });

  it("returns the public repo count from GitHub", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ public_repos: 42 }), { status: 200 }));

    expect(await getPublicRepoCount()).toBe(42);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.github.com/users/developerjayuk",
      expect.objectContaining({ next: { revalidate: 86400 } })
    );
  });

  it("returns null when GitHub responds with an error", async () => {
    fetchMock.mockResolvedValue(new Response("rate limited", { status: 403 }));

    expect(await getPublicRepoCount()).toBeNull();
  });

  it("returns null when the response has no repo count", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ message: "Not Found" }), { status: 200 }));

    expect(await getPublicRepoCount()).toBeNull();
  });

  it("returns null when the request fails", async () => {
    fetchMock.mockRejectedValue(new Error("network down"));

    expect(await getPublicRepoCount()).toBeNull();
  });
});

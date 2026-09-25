import { render, screen } from "@testing-library/react";
import About from "./About";
import { aboutData } from "@/assets";
import { getPublicRepoCount } from "@/lib/github";

jest.mock("@/lib/github");

// the real Achievements counts up on scroll, so render the final amount directly
jest.mock("./sub/Achievements", () => ({
  __esModule: true,
  default: ({ title, amount }: { title: string; amount: number }) => (
    <p>
      {title}: {amount}
    </p>
  ),
}));

const mockRepoCount = getPublicRepoCount as jest.MockedFunction<typeof getPublicRepoCount>;
const staticRepoCount = aboutData.find((item) => item.title === "Github Repos")!.amount;

describe("About", () => {
  it("shows the live GitHub repo count", async () => {
    mockRepoCount.mockResolvedValue(42);

    render(await About());

    expect(screen.getByText("Github Repos: 42")).toBeInTheDocument();
  });

  it("falls back to the static repo count when GitHub is unavailable", async () => {
    mockRepoCount.mockResolvedValue(null);

    render(await About());

    expect(screen.getByText(`Github Repos: ${staticRepoCount}`)).toBeInTheDocument();
  });
});

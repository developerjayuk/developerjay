import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Toggle from "./Toggle";

const mockSystemDarkMode = (dark: boolean) => {
  (window.matchMedia as jest.Mock).mockImplementation((query: string) => ({
    matches: dark && query === "(prefers-color-scheme: dark)",
    media: query,
  }));
};

const renderToggle = () => {
  render(
    <Toggle>
      <p>content</p>
    </Toggle>
  );
  return screen.getByRole("main");
};

describe("Toggle", () => {
  beforeEach(() => {
    localStorage.clear();
    mockSystemDarkMode(false);
  });

  it("renders its children", () => {
    renderToggle();

    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("defaults to light mode when the OS prefers light", () => {
    expect(renderToggle()).not.toHaveClass("dark");
  });

  it("defaults to dark mode when the OS prefers dark", () => {
    mockSystemDarkMode(true);

    expect(renderToggle()).toHaveClass("dark");
  });

  it("uses the saved preference over the OS setting", () => {
    mockSystemDarkMode(true);
    localStorage.setItem("darkTheme", "false");

    expect(renderToggle()).not.toHaveClass("dark");
  });

  it("switches theme on click and saves the choice", async () => {
    const main = renderToggle();

    await userEvent.click(screen.getByRole("button"));
    expect(main).toHaveClass("dark");
    expect(localStorage.getItem("darkTheme")).toBe("true");

    await userEvent.click(screen.getByRole("button"));
    expect(main).not.toHaveClass("dark");
    expect(localStorage.getItem("darkTheme")).toBe("false");
  });
});

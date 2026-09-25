import { act, render, screen } from "@testing-library/react";
import NavBar from "./NavBar";
import { navbarData } from "@/assets";

describe("NavBar", () => {
  it("renders a link to every section", () => {
    render(<NavBar />);

    navbarData.forEach((nav) => {
      expect(screen.getByText(nav.name).closest("a")).toHaveAttribute("href", `/#${nav.id}`);
    });
  });

  it("highlights only the section scrolled into view", () => {
    let onIntersect: IntersectionObserverCallback = () => {};
    const observe = jest.fn();
    const OriginalObserver = window.IntersectionObserver;
    window.IntersectionObserver = jest.fn((callback: IntersectionObserverCallback) => {
      onIntersect = callback;
      return { observe, unobserve: jest.fn(), disconnect: jest.fn(), takeRecords: jest.fn(() => []) };
    }) as unknown as typeof IntersectionObserver;

    render(
      <>
        <NavBar />
        {navbarData.map((nav) => (
          <div key={nav.id} id={nav.id} />
        ))}
      </>
    );

    expect(observe).toHaveBeenCalledTimes(navbarData.length);

    act(() => {
      onIntersect(
        [{ isIntersecting: true, target: document.getElementById("projects")! } as unknown as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    navbarData.forEach((nav) => {
      const icon = screen.getByText(nav.name).previousElementSibling;
      if (nav.id === "projects") expect(icon).toHaveClass("text-red-500");
      else expect(icon).toHaveClass("text-yellow-500");
    });

    window.IntersectionObserver = OriginalObserver;
  });

  it("shows the current year", () => {
    render(<NavBar />);

    expect(screen.getByText(new Date().getFullYear().toString(), { exact: false })).toBeInTheDocument();
  });
});

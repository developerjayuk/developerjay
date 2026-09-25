import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Projects from "./Projects";
import { projectsData } from "@/assets";

// each project's name is shown twice: as a label above the card and in the hover overlay
const visibleProjectNames = () =>
  projectsData.map((p) => p.name).filter((name) => screen.queryAllByText(name).length > 0);

describe("Projects", () => {
  it("shows every project by default", () => {
    render(<Projects />);

    expect(visibleProjectNames()).toEqual(projectsData.map((p) => p.name));
  });

  it("filters projects by the selected tech", async () => {
    render(<Projects />);

    await userEvent.click(screen.getByRole("button", { name: "Angular" }));

    const expected = projectsData.filter((p) => p.tech.includes("Angular")).map((p) => p.name);
    expect(visibleProjectNames()).toEqual(expected);
  });

  it("shows every project again when 'All' is selected", async () => {
    render(<Projects />);

    await userEvent.click(screen.getByRole("button", { name: "Javascript" }));
    await userEvent.click(screen.getByRole("button", { name: "All" }));

    expect(visibleProjectNames()).toEqual(projectsData.map((p) => p.name));
  });
});

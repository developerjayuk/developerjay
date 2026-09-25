import fs from "fs";
import path from "path";
import { navbarData, projectsButton, projectsData, skillsData, uniqueTech } from "@/assets";
import { SkillLevel } from "@/assets/models";

const publicFile = (src: string) => path.join(process.cwd(), "public", src);

describe("projectsData", () => {
  it("has an existing image for every project", () => {
    const missing = projectsData.filter((p) => !fs.existsSync(publicFile(p.image)));
    expect(missing.map((p) => p.image)).toEqual([]);
  });

  it("has unique project names", () => {
    const names = projectsData.map((p) => p.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("has at least one tech tag per project", () => {
    projectsData.forEach((p) => expect(p.tech.length).toBeGreaterThan(0));
  });

  it("uses valid https urls", () => {
    projectsData
      .filter((p) => p.url)
      .forEach((p) => expect(new URL(p.url!).protocol).toBe("https:"));
  });
});

describe("projectsButton", () => {
  it("starts with 'All' followed by each unique tech once", () => {
    expect(projectsButton[0]).toBe("All");
    expect(projectsButton.slice(1)).toEqual(uniqueTech);
    expect(new Set(projectsButton).size).toBe(projectsButton.length);
  });

  it("covers every tech used by a project", () => {
    projectsData.flatMap((p) => p.tech).forEach((tech) => expect(projectsButton).toContain(tech));
  });
});

describe("skillsData", () => {
  it("has an existing icon for every skill", () => {
    const missing = skillsData.filter((s) => !fs.existsSync(publicFile(s.icon)));
    expect(missing.map((s) => s.icon)).toEqual([]);
  });

  it("has unique skill names", () => {
    const names = skillsData.map((s) => s.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("has a positive experience and a valid level for every skill", () => {
    skillsData.forEach((s) => {
      expect(s.exp).toBeGreaterThan(0);
      expect(Object.values(SkillLevel)).toContain(s.level);
    });
  });
});

describe("navbarData", () => {
  const componentsSource = fs
    .readdirSync(path.join(process.cwd(), "src/components"))
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => fs.readFileSync(path.join(process.cwd(), "src/components", f), "utf8"))
    .join("\n");

  it("has unique ids", () => {
    const ids = navbarData.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(navbarData.map((n) => n.id))("links to a section with id '%s'", (id) => {
    expect(componentsSource).toContain(`id="${id}"`);
  });
});

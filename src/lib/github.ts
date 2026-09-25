const GITHUB_USERNAME = "developerjayuk";

// public repo count shown in the About stats, cached for a day; null if GitHub can't be reached
export async function getPublicRepoCount(): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
      headers: {
        Accept: "application/vnd.github+json",
        ...(process.env.GITHUB_TOKEN && { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }),
      },
      next: { revalidate: 86400 },
    });

    if (!res.ok) return null;

    const data = await res.json();
    return typeof data.public_repos === "number" ? data.public_repos : null;
  } catch {
    return null;
  }
}

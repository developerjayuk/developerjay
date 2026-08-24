import { NextResponse } from "next/server";

const GITHUB_USERNAME = "developerjayuk";

export async function GET() {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
      headers: {
        Accept: "application/vnd.github+json",
        ...(process.env.GITHUB_TOKEN && { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }),
      },
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      return NextResponse.json({ publicRepos: null }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json({ publicRepos: data.public_repos as number });
  } catch {
    return NextResponse.json({ publicRepos: null }, { status: 502 });
  }
}

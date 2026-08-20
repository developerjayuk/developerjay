import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Don't let `next dev` auto-inject its version-warning block into our hand-authored CLAUDE.md.
  agentRules: false,
};

export default nextConfig;

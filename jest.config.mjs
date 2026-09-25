import nextJest from "next/jest.js";

// loads next.config and .env files, and handles TS/JSX, CSS and image imports
const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  // archived/ holds old versions of the site with their own (unrunnable) tests
  testPathIgnorePatterns: ["/node_modules/", "<rootDir>/archived/"],
  modulePathIgnorePatterns: ["<rootDir>/archived/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default createJestConfig(config);

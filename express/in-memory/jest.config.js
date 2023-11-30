module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/__tests__/**/*.test.(ts|js)"],
  // globalSetup: "<rootDir>/__tests__/__helpers__/global-setup.js",
  // setupFiles: ["<rootDir>/__tests__/setupTests.ts"],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts"],
  coverageDirectory: "coverage",
};

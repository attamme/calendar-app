module.exports = {
  preset: "jest-expo",
  testMatch: ["<rootDir>/**/*.test.ts?(x)"],
  testPathIgnorePatterns: ["/node_modules/", "/.expo/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "\\.svg$": "<rootDir>/test/svgMock.tsx",
  },
};

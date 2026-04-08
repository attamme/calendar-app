module.exports = {
  preset: "jest-expo",
  testMatch: ["<rootDir>/components/__tests__/**/*.test.ts?(x)"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};

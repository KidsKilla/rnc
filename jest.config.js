module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
  setupFilesAfterEnv: [],
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
  modulePaths: [],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};

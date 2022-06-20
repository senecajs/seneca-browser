module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.js'],
  watchPathIgnorePatterns: ['dist\\/'],
  collectCoverageFrom: ['src/**/*.js'],
  coverageProvider: 'v8',
};

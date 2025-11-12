module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  collectCoverageFrom: [
    'controllers/**/*.ts',
    'routes/**/*.ts',
    'middleware/**/*.ts',
    'models/**/*.ts',
    'utils/**/*.ts'
  ],
  testTimeout: 30000,
  forceExit: true,
  clearMocks: true,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
};

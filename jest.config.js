/**
 * Plain Jest config using babel-jest (avoid Next SWC native bindings).
 */
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'text-summary'],
  collectCoverageFrom: [
    'lib/**/*.{js,jsx,ts,tsx}',
    'scripts/**/*.{js,jsx,ts,tsx}',
    'db/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
    'actions/**/*.{js,jsx,ts,tsx}',
    'types/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/__tests__/**/*',
    '!**/*.test.{js,jsx,ts,tsx}',
    '!**/*.spec.{js,jsx,ts,tsx}',
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '/public/'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  transform: {
    '^.+\\.(t|j)sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!.*)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    // CSS and style imports
    '^.+\\.(css|scss|sass|less)$': '<rootDir>/__mocks__/styleMock.js',
    // Static asset imports
    '^.+\\.(png|jpg|jpeg|gif|webp|svg|ico|bmp)$': '<rootDir>/__mocks__/fileMock.js',
  },
}

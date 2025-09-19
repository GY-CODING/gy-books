/* eslint-disable no-undef */
/* ...existing code... */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
    '!src/**/__mocks__/**',
  ],
  coverageReporters: ['html'],
  testPathIgnorePatterns: [
    '<rootDir>/.nvm/',
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/.git/',
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/.nvm/',
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/.git/',
  ],
  moduleNameMapper: {
    '^@/app/components/atoms/BookCardCompact(\\.(ts|tsx|js|jsx))?$':
      '<rootDir>/__mocks__/BookCardCompact.js',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^next/font/google$': '<rootDir>/__mocks__/nextFontGoogleMock.js',
    '^next/image$': '<rootDir>/__mocks__/next-image-mock.js',
    '^@auth0/nextjs-auth0$': '<rootDir>/__mocks__/auth0Mock.js',
    '^@auth0/nextjs-auth0/server$': '<rootDir>/__mocks__/auth0Mock.js',
  },
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
        },
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [
    '/node_modules/(?!(@auth0/nextjs-auth0)/)',
  ],
};
/* ...existing code... */

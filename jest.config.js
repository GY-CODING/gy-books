/* eslint-disable no-undef */
/* ...existing code... */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
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
  transformIgnorePatterns: ['/node_modules/'],
};
/* ...existing code... */

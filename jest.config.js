module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
    '!src/**/index.ts',
  ],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/main/typescript/$1',
    '^@models/(.*)$': '<rootDir>/src/main/typescript/models/$1',
    '^@services/(.*)$': '<rootDir>/src/main/typescript/services/$1',
    '^@utils/(.*)$': '<rootDir>/src/main/typescript/utils/$1',
    '^@api/(.*)$': '<rootDir>/src/main/typescript/api/$1',
    '^@core/(.*)$': '<rootDir>/src/main/typescript/core/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
};
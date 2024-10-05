module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/packages/$1/src/$1',
  },
  roots: ['<rootDir>/packages/'],
};

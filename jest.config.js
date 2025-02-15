module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
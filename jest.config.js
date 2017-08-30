module.exports = {
  verbose: true,
  cacheDirectory: '.boldr/cache/jest',
  clearMocks: true,
  timers: 'fake',
  testRegex: '.*.test\\.js',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      './internal/jest/fileMock.js',
    '\\.(css|scss)$': 'identity-obj-proxy',
  },

  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/packages/*/(internal|build|lib|dist)/',
    '/__snapshots__/',
  ],
  testEnvironment: 'jsdom',
  setupTestFrameworkScriptFile: './internal/jest/setup.js',
  transform: {
    '^.+\\.jsx?$': './internal/jest/transform.js',
    '\\.(gql|graphql)$': 'jest-transform-graphql',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'packages/auth/src/**/*.js',
    'packages/core/src/**/*.js',
    'packages/frontend/src/**/*.js',
    'packages/utils/src/**/*.js',
    '!packages/utils/src/gql/*.js',
    '!packages/utils/src/node/*.js',
    '!packages/core/src/util/*.js',
    '!packages/core/src/shared/*.js',
    '!packages/core/src/apollo/batchNetworkInterface.js',
    '!packages/core/src/apollo/networkInterface.js',
    '!packages/core/src/apollo/extractFiles.js',
    '!packages/core/src/client.js',
    '!packages/core/src/common.js',
    '!packages/core/src/server.js',
    '!packages/frontend/src/clientEntry.js',
    '!packages/frontend/src/serverEntry.js',
    '!packages/frontend/src/vendor.js',
    '!packages/frontend/src/theme/*.js',
    '!packages/**/src/**/*.styled.js',
    '!packages/**/index.js',
  ],
  coveragePathIgnorePatterns: [
    '/flow-typed/',
    '/__fixtures__/',
    '<rootDir>/packages/tools/',
    '<rootDir>/packages/server/',
    '<rootDir>/packages/cli',
    '<rootDir>/node_modules/',
    '<rootDir>/packages/*/node_modules/',
  ],
  coverageDirectory: 'coverage',
};

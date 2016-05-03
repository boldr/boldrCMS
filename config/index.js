/* eslint-disable */
var yargs = require('yargs');
var path = require('path');

var NODE_ENV = process.env.NODE_ENV || 'development';

const config = {

  // Environment
  __CLIENT__: true,
  __SERVER__: false,
  __DEV__: NODE_ENV === 'development',
  __PROD__: NODE_ENV === 'production',
  __DEBUG__: !!yargs.argv.debug,

  // Server Configuration
  SERVER_HOST: 'localhost',
  SERVER_PORT: process.env.PORT || 3000,

  // Webpack Configuration
  WEBPACK_DEV_SERVER_PORT: 3001,
  VENDOR_DEPENDENCIES: [
    'react',
    'react-dom',
    'react-redux',
    'react-router',
    'react-router-redux',
    'redux',
    'lodash',
    'classnames',
    'superagent'
  ],
  TESTDB_HOST: process.env.TEST_DB_HOST || '10.211.55.7',
  TESTDB_NAME: process.env.TEST_DB_NAME || 'boldr_test',
  TESTDB_USER: process.env.TEST_DB_USER || 'postgres',
  TESTDB_PASS: process.env.TEST_DB_PASS || 'postgres',

  // Project Structure
  PATH_BASE: path.resolve(__dirname, '../'),
  ENTRY_APP: 'index',
  DIR_SRC: 'src',
  DIR_CLIENT: 'client',
  DIR_STATIC: 'static',
  DIR_DIST: 'dist',
  DIR_BUILD: 'build',
  DIR_SERVER: 'server',
  DIR_TEST: '__tests__',
  DIR_NODE_MODULES: 'node_modules'
};

const paths = (dir = 'base') => {
  const resolve = path.resolve;
  const base = (...args) => (
    resolve.apply(resolve, [config.PATH_BASE, ...args])
  );
  const _paths = {
    base: base(),
    entryApp: base(config.DIR_SRC, config.DIR_CLIENT, config.ENTRY_APP),
    src: base(config.DIR_SRC),
    dist: base(config.DIR_STATIC, config.DIR_DIST),
    build: base(config.DIR_BUILD),
    server: base(config.DIR_SERVER),
    test: base(config.DIR_TEST),
    nodeModules: base(config.DIR_NODE_MODULES)
  };

  return _paths[dir];
};

export { config as default, paths };

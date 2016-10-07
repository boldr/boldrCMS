delete process.env.BROWSER;
require('babel-core/register');

const path = require('path');
const paths = require('../tools/paths');
const WebpackIsomorphicTools = require('webpack-isomorphic-tools');

const isomorphicConfig = require('../tools/webpack/isomorphic.config');

const ROOT_DIR = path.resolve(process.cwd());

global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = false;
global.__DEV__ = process.env.NODE_ENV !== 'production';
global.__DLLS__ = process.env.WEBPACK_DLLS === '1';
global.nodeRequire = require;
global.regeneratorRuntime = require('regenerator-runtime');

global.webpackIsomorphicTools = new WebpackIsomorphicTools(isomorphicConfig)
  .development(__DEV__)
  .server(paths.ABS_ROOT, () => {
    require(`${paths.CMS_SRC}/server.js`);
  });

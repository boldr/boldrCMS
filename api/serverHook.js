#!/usr/bin/env node
require('babel-register');
require('babel-polyfill');
require('babel-runtime/core-js/promise').default = require('bluebird');
const path = require('path');
const debug = require('debug');

const rootDir = path.resolve(__dirname, '..');
/**
 * Define isomorphic constants.
 */
global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = false;  // <----- DISABLES SERVER SIDE RENDERING FOR ERROR DEBUGGING
global.__DEV__ = process.env.NODE_ENV !== 'production';

debug.enable(process.env.DEBUG);
const log = {
  config: debug('config'),
  err: debug('app-error')
};

process.on('unhandledRejection', function(err) {
  log.err('Promise rejection unhandled', err.stack);
});

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
const WebpackIsomorphicTools = require('webpack-isomorphic-tools');
global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('../tools/webpack/isomorphic.config'))
  .development(__DEV__)
  .server(rootDir, () => {
    require('./webserver.js');
  });
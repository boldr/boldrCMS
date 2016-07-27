import Debug from 'debug';
import express from 'express';
import errorHandler from 'errorhandler';
import Boom from 'boom';
import httpProxy from 'http-proxy';

import { webserver, boldrSSR } from './core';

const debug = Debug('boldr:server');
const targetUrl = process.env.TARGET_URL || 'http://localhost:9121';
// Create our express server.
const app = express();
const proxy = httpProxy.createProxyServer({
  target: targetUrl,
  changeOrigin: true
});

debug('express middleware');
webserver(app);

app.use('/api/v1', (req, res) => {
  proxy.web(req, res, { target: targetUrl + '/api/v1' }); // eslint-disable-line
});

app.use('/auth', (req, res) => {
  proxy.web(req, res, { target: targetUrl + '/auth' }); // eslint-disable-line
});

// Server-side rendering
app.use(boldrSSR);

// Use Boom for 404 error handling.
app.use((req, res, next) => {
  next(Boom.notFound('Looks like you might be lost...'));
});

// Wrap other errors with Boom.
app.use((err, req, res, next) => {
  const { statusCode, payload } = Boom.wrap(err).output;
  res.status(statusCode).json(payload);
  next(err);
});
// Handle our errors.
app.use(errorHandler);

export default app;

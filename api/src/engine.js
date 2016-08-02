import _debug from 'debug';
import express from 'express';
import models from './db/models';
import routes from './api/routes';
import { webserver, errorHandling } from './core';

const debug = _debug('boldr:server');
// Create our express server.
const app = express();
app.set('models', models);
debug('express middleware');
webserver(app);

debug('routes');
app.use('/api/v1', routes);

errorHandling(app);

export default app;

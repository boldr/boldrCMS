import path from 'path';
import http from 'http';
// Server deps
import express from 'express';
import compression from 'compression';
import passport from 'passport';

// Boldr API Deps
import { conf, DbConnection, coreMiddleware, sessionMiddleware } from './api';
import routes from './api/modules/routes';
import { monkeyPatchRouteMethods } from './api/utils';
import getRoutes from './scenes/index';
import handleInitialRender from './core/handleInitialRender';

const debug = require('debug')('boldr:ssr-server');
const sourceMaps = require('source-map-support');

sourceMaps.install();
DbConnection.init();

const app = new express();
const server = http.createServer(app);

const port = conf.get('api.port');

app.use(compression());

app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, '..', 'static')));

coreMiddleware(app);
monkeyPatchRouteMethods(app);

app.use(passport.initialize());
app.use(sessionMiddleware);
app.use(passport.session());

app.use((req, res, next) => {
  passport.authenticate('jwt', (err, user, info) => {
    res.locals.user = !!user ? user : null;
    return next();
  })(req, res, next);
});

app.use(conf.get('api.base'), routes);

app.get('*', handleInitialRender);


if (port) {
  server.listen(port);
  console.log(`🎯   ===> Application running in ${process.env.NODE_ENV} on ${port}`);
} else {
  console.log('You need to specify a port in the configuration.');
}


export default server;

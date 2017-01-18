/**
 * Authentication Middleware
 * src/server/middleware/auth
 */
import jwt from 'jsonwebtoken';
import User from '../routes/user/user.model';
import config from '../../../config';
import sessionMiddleware from './session';

const debug = require('debug')('boldr:authMW');

export default (app) => {
  app.use(sessionMiddleware);
  app.use(async (req, res, next) => {
    req.isAuthenticated = () => {
      const token = (req.headers.authorization && req.headers.authorization.split(' ')[1]);
      try {
        return jwt.verify(token, config.token.secret);
      } catch (err) {
        return false;
      }
    };

    if (req.isAuthenticated()) {
      const payload = req.isAuthenticated();
      const user = await User.query().findById(payload.sub).eager('[roles]');
      req.user = user;
      next();
    } else {
      next();
    }
  });
};
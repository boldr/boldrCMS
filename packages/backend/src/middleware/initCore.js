import cookieParser from 'cookie-parser';
import nanoid from 'nanoid';
import bodyParser from 'body-parser';
import localeMiddleware from 'express-locale';
import config from '@boldr/config';

export default function initCore(app, { locale }) {
  // give each request a unique id
  app.use((req, res, next) => {
    res.set('Request-Id', nanoid());
    next();
  });
  // disable etags
  app.disable('etag');
  // send json back w/ 2 spaces
  app.set('json spaces', 2);
  app.use(
    localeMiddleware({
      priority: ['query', 'cookie', 'accept-language', 'default'],
      default: locale.default.replace(/-/, '_'),
      allowed: locale.supported.map(entry => entry.replace(/-/, '_')),
    }),
  );
  // Parse cookies
  app.use(cookieParser(config.get('token.secret')));
  // Parse application/json
  app.use(bodyParser.json({ type: 'application/json' }));
  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: true }));
}

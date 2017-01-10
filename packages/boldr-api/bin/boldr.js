require('dotenv').load();

if (process.env.NODE_ENV !== 'production') {
  throw Error('BoldrCMS is trying to run in production mode, but the NODE_ENV is not set properly.');
}

require('../lib/index.js');
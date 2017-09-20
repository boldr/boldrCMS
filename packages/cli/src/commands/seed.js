import path from 'path';
import knex from 'knex';
import fs from 'fs-extra';
import config from '@boldr/config';
import logger from '@boldr/utils/lib/logger';
import appRoot from '@boldr/utils/lib/node/appRoot';

async function task(args, options) {
  logger.task('Seeding database');
  const rootDir = appRoot.get();
  fs.ensureDirSync('.boldr/db/migrations');
  const knexConfig = {
    client: 'pg',
    connection: options.dburl || config.get('db.url'),
    migrations: {
      tableName: 'migrations',
      directory: path.resolve(rootDir, '.boldr/db/migrations'),
    },
    seeds: {
      directory: path.resolve(rootDir, '.boldr/db/seeds'),
    },
  };

  const db = knex(knexConfig);
  await db.seed.run(knexConfig);
}

function register(program) {
  program
    .command('seed', 'Remove files or directories.')
    .help('By default, cache, assets dir and the compiled server are removed.')
    .option('-u,  --url <dburl>', 'Database connection url')
    .action(task);
}

export default { register };

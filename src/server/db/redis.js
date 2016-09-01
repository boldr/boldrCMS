import Redis from 'ioredis';
import bluebird from 'bluebird';
import { logger } from '../core';
import { conf } from '../core/config';

bluebird.promisifyAll(Redis);

const redisClient = new Redis(conf.get('redis.uri'));

redisClient.on('connect', () => {
  logger.info('redis has connected');
});

redisClient.on('error', err => {
  logger.error(err);
  process.exit(1);
});

redisClient.on('close', () => {
  logger.warn('redis has closed.');
  process.exit(1);
});

redisClient.on('reconnecting', () => {
  logger.info('redis is reconnecting');
});

export default redisClient;

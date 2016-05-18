import _debug from 'debug';
import r from 'server/db';
// import User from '../../db/models/user';
import logger from '../../utils/logger';
import jwt from 'jsonwebtoken';
import config, { paths } from '../../../../tools/config';
import getToken from '../../auth/getToken';
const debug = _debug('boldr:user:controller');
debug('init');

/**
 * Returns a listing of all the user users in the database.
 * r.db('boldr_dev').table('users').eqJoin('roleId', r.db('boldr_dev').table('roles'))
 * .without([{left: ['password']}, {right: 'roleId'}]).zip()
 * @method getUsers
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
export async function getAll(ctx) {
  const users = await r.table('users')
  .without('password')
  // .eqJoin('roleId', r.table('roles'))
  // .zip()
  .run((err, user) => {
    if (err) {
      throw err;
    }
    return ctx.ok(user);
  });
}

/**
 * Performs a lookup of a user by their id.
 * @param  {[type]}   ctx  context of the request
 * @param  {Function} next continue to the next middleware
 * @return {Object}        the User object.
 */
export async function getId(ctx, next) {
  try {
    const user = await r.table('users')
      .get(ctx.params.id)
      .without('password')
      .run();
    return ctx.ok(user);
  } catch (err) {
    return ctx.badRequest('User is Not Found');
  }
}

export async function update(ctx) {
  const result = await r.table('users')
    .get(ctx.params.id)
    .update(ctx.request.body)
    .run();
  return ctx.ok(result);
}

export async function destroy(ctx) {
  const result = await r.table('users')
    .get(ctx.params.id)
    .delete()
    .run();

  return ctx.ok();
}

export async function addRoleToUser(ctx) {
  const userId = ctx.params.id;
  try {
    r
    .table('users')
    .get(userId)
    .update({ roleId: ctx.request.body.roleId })
    .run()
    .then(() => {
      return r
       .table('users')
       .get(userId)
       .run()
       .error(err => err);
    })
    .error(err => err);
    return ctx.ok();
  } catch (error) {
    return ctx.error('Error adding the role to the requested user.');
  }
}

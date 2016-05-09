import _debug from 'debug';

import Account from '../../db/models/account';
import config, { paths } from '../../../../tools/config';

const debug = _debug('boldr:account:controller');
debug('init');
/**
 * Returns a listing of all the user accounts in the database.
 * @method getUsers
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
export async function getAccounts(ctx) {
  const accounts = await Account.getJoin({
    profile: true
  }).run();
  return ctx.ok(accounts);
}

/**
 * Performs a lookup of a user by their id.
 * @param  {[type]}   ctx  context of the request
 * @param  {Function} next continue to the next middleware
 * @return {Object}        the User object.
 */
export async function getAccountById(ctx, next) {
  try {
    const account = await Account.get(ctx.params.id).run();
    if (!account) {
      return ctx.badRequest('Account is Not Found');
    }

    return ctx.ok(account);
  } catch (err) {
    return ctx.badRequest('Account is Not Found');
  }
}

export async function updateAccount(ctx) {
  if (ctx.request.body._id) {
    delete ctx.request.body._id;
  }
  const account = await Account.get(ctx.params.id);
  Object.assign(account, ctx.request.body);
  await account.save();

  ctx.body = {
    account
  };
}

export async function deleteUser(ctx) {
  const account = Account.get(ctx.params.id);

  await account.remove();

  ctx.status = 200;
  return ctx.ok();
}

export async function getMe(ctx) {
  const me = await Account.get(ctx.account.id.id).run();
  return ctx.ok(me);
}

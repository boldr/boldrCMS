import bcrypt, { genSaltSync, hashSync, compareSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import _debug from 'debug';
import User from '../../db/models/user';
import uuid from 'node-uuid';
import config, { paths } from '../../../../tools/config';
import { returnCode, response, saltAndHashPassword, respond } from '../../utils';

const debug = _debug('boldr:auth:controller');
debug('init');

/**
 * @description
 * registers a new user
 * @route /api/v1/auth/register
 * @method POST
 */
export const registerUser = async ctx => {
  saltAndHashPassword(ctx.request.body.password)
    .then(hash => {
      User.forge({
        username: ctx.request.body.username,
        display_name: ctx.request.body.displayName,
        first_name: ctx.request.body.firstName,
        last_name: ctx.request.body.lastName,
        location: ctx.request.body.location,
        website: ctx.request.body.website,
        slug: ctx.request.body.slug,
        status: ctx.request.body.status,
        uuid: uuid.v4(),
        avatar: ctx.request.body.avatar,
        bio: ctx.request.body.bio,
        facebook: ctx.request.body.facebook,
        twitter: ctx.request.body.twitter,
        password: hash,
        email: ctx.request.body.email,
        role: 'admin'
      }).save();
    });

  respond(201, {
    message: 'Registration successful.'
  }, ctx);
};

/**
 * @description
 * logs a user into his or her account.
 * @route /api/v1/auth/login
 * @method POST
 */
export const loginUser = async ctx => {
  const { email, password } = ctx.request.body;
  const fieldName = email.indexOf('@') > 0 ? 'email' : 'username';
  const user = await User.where(fieldName, email)
    .fetch({
      columns: ['password', 'id']
    })
    .then(result => {
      if (!compareSync(ctx.request.body.password, result.attributes.password)) {
        ctx.body = 'invalid credentials';
        return;
      }
      const token = jwt.sign(result.id, config.JWT_SECRET_KEY);
      ctx.body = token;
    });
};

import crypto from 'crypto';
import async from 'async';
import moment from 'moment';
import passport from 'passport';

import {
  handleMail,
  generateVerifyCode,
  mailResetPassword,
  mailPasswordConfirm,
  RespondError,
  UNAUTHORIZED_MSG,
  ACCOUNT_404_MSG,
  FUBAR_MSG
} from '../lib';
import { User, VerificationToken } from '../db/models';
import { signToken } from './auth.service';

function handleLogin(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    const error = err || info;
    if (error) {
      return next(new RespondError(UNAUTHORIZED_MSG, 401, true));
    }
    if (!user) {
      return next(new RespondError(ACCOUNT_404_MSG, 404, true));
    }
    const token = signToken(user.id, user.role);
    return res.json({ token, user });
  })(req, res, next);
}


/**
 * DELETE /account
 */
const accountDelete = (req, res, next) => {
  return User.findById(req.user.id).destroy().then((user) => {
    res.status(204).json('Your account has been permanently deleted.');
  });
};
/**
 * @api {post} /auth/logout           Remove the session information
 * @apiVersion 1.0.0
 * @apiName logout
 * @apiGroup Auth
 */
function logout(req, res) {
  req.session.destroy();
  res.redirect('/');
}

/**
 * @api {post} /auth/signup           Create a new account.
 * @apiVersion 1.0.0
 * @apiName signup
 * @apiGroup Auth
 */
async function handleSignup(req, res, next) {
  try {
    const userData = {
      email: req.body.email,
      password: req.body.password,
      displayName: req.body.displayName,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      location: req.body.location,
      bio: req.body.bio,
      avatarUrl: req.body.avatarUrl,
      gender: req.body.gender,
      website: req.body.website,
      provider: 'local'
    };
    const user = await User.create(userData);
    // Generate the verification token.
    // const verificationToken = await generateVerifyCode();
    // // Send the verification email.
    // const subj = '[Boldr] Confirmation mail';
    // handleMail(user.email, subj, verificationToken);
    // // sendVerifyEmail(user.email, verificationToken);
    // // Store the verification token, userId and expiration date in the db.
    // const verificationStorage = await VerificationToken.create({
    //   userId: user.id,
    //   token: verificationToken,
    //   expiresAt: moment().add(3, 'days')
    // });
    // // Save token.
    // verificationStorage.save();
    res.status(201).send({
      token: signToken(user), user
    });
  } catch (err) {
    return next(new RespondError(`${FUBAR_MSG} ${err}`, 500, true));
  }
}

function checkUser(req, res, next) {
  const userId = req.user.id;
  return User.find({
    where: {
      id: userId
    },
    attributes: [
      'id',
      'firstName',
      'lastName',
      'email',
      'displayName',
      'bio',
      'location',
      'birthday',
      'gender',
      'avatarUrl',
      'roleId',
      'provider'
    ]
  })
    .then(user => { // don't ever give out the password or salt
      if (!user) {
        return next(new RespondError(UNAUTHORIZED_MSG, 401, true));
      }
      res.json(user);
    })
    .catch(err => {
      req.session.destroy();
      return next(new RespondError(UNAUTHORIZED_MSG, 401, true));
    });
}

function forgottenPassword(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(16, (err, buf) => {
        const token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.find({
        where: {
          email: req.body.email
        }
      })
        .then((user) => {
          if (!user) {
            return next(new RespondError(`
              The email address ${req.body.email} is not associated with any account.`,
              404, true));
          }
          user.update({ resetPasswordToken: token });
          user.update({ resetPasswordExpires: new Date(Date.now() + 3600000) }); // expire in 1 hour
          return done(null, token, user.toJSON());
        });
    },
    function(token, user, done) {
      const subj = '[Boldr] Password Reset';
      mailResetPassword(user.email, subj, token, (err) => {
        done(err);
      });
      return res.status(200).json(user);
    }
  ]);
}

async function resetPassword(req, res, next) {
  const user = await User.find({ where: { resetPasswordToken: req.params.token } }).then(user => {
    if (!user) {
      return next(new RespondError(ACCOUNT_404_MSG, 404, true));
    } else {
      user.password = req.body.password;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      return user.save();
    }
  });
  const subj = '[Boldr] Password Changed';
  const sentMail = await mailPasswordConfirm(user.email, subj);
  return res.status(200).json(sentMail);
}

export {
  accountDelete,
  logout,
  handleSignup,
  checkUser,
  handleLogin,
  forgottenPassword,
  resetPassword
};

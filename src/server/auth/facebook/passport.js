import { Strategy as FacebookStrategy } from 'passport-facebook';
import config from '../../core/config';
import { User } from '../../db/models';

export default (passport) => {
  passport.use(new FacebookStrategy.Strategy({
    clientID: config.FACEBOOK_ID,
    clientSecret: config.FACEBOOK_SECRET,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'name', 'emails']
  }, (token, refreshToken, profile, done) => {
    User.findOne({ where: { facebook: profile.id } }).then((user) => {
      if (user) {
        return done(null, user);
      } else {
        User.sync().then(() => {
          return User.create({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            facebook: profile.id,
            email: profile.emails[0].value
          });
        }).then((user) => {
          return done(null, user);
        });
      }
    });
  }));
};

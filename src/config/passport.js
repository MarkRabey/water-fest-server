import {
  Strategy as JwtStrategy,
  ExtractJwt
} from 'passport-jwt';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config({ silent: process.env.NODE_ENV === 'production' });

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;

export default passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    }),
  );

  passport.use(
    new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${ process.env.APP_URL }/auth/google/callback`
    },
    function(accessToken, refreshToken, profile, done) {
      const userData = {
        email: profile.emails[0].value,
        name: profile.displayName,
        token: accessToken,
      };
      done(null, userData);
    }),
  );
};
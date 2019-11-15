import { Strategy, ExtractJwt } from 'passport-jwt';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config({ silent: process.env.NODE_ENV === 'production' });

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;

export default passport => {
  passport.use(
    new Strategy(opts, (jwt_payload, done) => {
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
};
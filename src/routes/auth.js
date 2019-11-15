import express from 'express';
import passport from 'passport';

export default () => {
  const router = express.Router({
    caseSensitive: true,
  });

  router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
  }));

  router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/',
    session: false,
  }), (request, response) => {
    const token = request.user.token;
    response.redirect('http://localhost:3000?token=' + token);
  });

  return router;
}
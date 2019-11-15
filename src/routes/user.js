import express from 'express';
import User from '../models/User';
import auth from '../middleware/auth';

export default () => {
  const router = express.Router({
    caseSensitive: true,
  });

  router.get('/', async (req, res, next) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      next(error)
    }
  });

  router.post('/', async (request, response) => {
    try {
      const user = new User(request.body);
      await user.save();
      const token = await user.generateAuthToken();
      response.status(200).json({ user, token });
    } catch (error) {
      response.status(400).send(error);
    }
  });

  router.post('/login', async (request, response) => {
    try {
      const { email, password } = request.body;
      const user = await User.findByCredentials(email, password);
      if (!user) {
        return response.status(401).send({ error: 'Login failed. Check authentication credentials.' });
      }
      const token = await user.generateAuthToken();
      response.json({ user, token });
    } catch (error) {
      response.status(400).send(error);
    }
  });

  router.get('/me', auth, async (request, response) => {
    response.json(request.user);
  });

  router.get('/logout', auth, async (request, response) => {
    try {
      request.user.tokens = request.user.tokens.filter(token => token.token !== request.token);
      await request.user.save();
      response.send();
    } catch (error) {
      response.status(500).send(error);
    }
  });

  router.get('/logout-all', auth, async (request, response) => {
    try {
      request.user.tokens.splice(0, request.user.tokens.length)
      await request.user.save();
      response.send();
    } catch (error) {
      response.status(500).send(error);
    }
  });

  return router;
}
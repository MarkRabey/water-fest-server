import express from 'express';
import User from '../models/User';
import auth from '../middleware/auth';
import jwt from 'jsonwebtoken';
import { verifyJwt } from '../utils/verifyJwt';

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

  router.post('/register', async (request, response) => {
    try {
      const user = await User.findOne({ email: request.body.email });
      if (user) {
        return res.status(400).json({ email: "Email already exists" });
      } else {
        const newUser = new User(request.body);
        await newUser.save();
        const token = await newUser.generateAuthToken();
        response.status(200).json({ user: newUser, token });
      }
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
      response.json({ success: true , token: `Bearer ${ token }` });
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
import express from 'express';
import User from '../models/User';
import auth from '../middleware/auth';

export default () => {
  const router = express.Router({
    caseSensitive: true,
  });

  router.get('/', auth, async (req, res, next) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      next(error)
    }
  });

  router.post('/register', async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ email: "Email already exists" });
      } else {
        const newUser = new User(req.body);
        await newUser.save();
        const token = await newUser.generateAuthToken();
        res.status(200).json({ user: newUser, token });
      }
    } catch (error) {
      res.status(400).send(error);
    }
  });

  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findByCredentials(email, password);
      if (!user) {
        return res.status(401).send({ error: 'Login failed. Check authentication credentials.' });
      }
      const token = await user.generateAuthToken();
      res.json({ success: true , token: `Bearer ${ token }` });
    } catch (error) {
      res.status(400).send(error);
    }
  });

  router.get('/me', auth, async (req, res) => {
    res.json(req.user);
  });

  router.get('/logout', auth, async (req, res) => {
    try {
      req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
      await req.user.save();
      res.send();
    } catch (error) {
      res.status(500).send(error);
    }
  });

  router.get('/logout-all', auth, async (req, res) => {
    try {
      req.user.tokens.splice(0, req.user.tokens.length)
      await req.user.save();
      res.send();
    } catch (error) {
      res.status(500).send(error);
    }
  });

  return router;
}
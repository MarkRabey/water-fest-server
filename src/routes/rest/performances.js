import express from 'express';
import Performance from '../../models/Performance';
import auth from '../../middleware/auth';

export default () => {
  
  const router = express.Router({
    caseSensitive: true,
  });

  router.get('/', async (request, response, next) => {
    try {
      const performances = await Performance.find();
      response.json(performances);
    } catch (error) {
      next(error);
    }
  });

  router.post('/', auth, async (request, response, next) => {
    try {
      const performance = await Performance.create(request.body);
      response.json(performance);
    } catch (error) {
      next(error);
    }
  });

  router.route('/:id')
    .get(async (request, response, next) => {
      const performance = await Performance.findById(request.params.id);
      response.json(performance);
    });

  router.route('*')
    .get((request, response) => {
      response.json({
        status: 200,
        endpoints: [
          '/artists',
          '/stages',
          '/performances',
        ],
      })
    });

  return router;
}

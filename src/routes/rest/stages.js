import express from 'express';
import Stage from '../../models/Stage';
import auth from '../../middleware/auth';

export default () => {
  
  const router = express.Router({
    caseSensitive: true,
  });

  router.get('/', async (request, response, next) => {
    try {
      const stages = await Stage.find();
      response.json(stages);
    } catch (error) {
      next(error);
    }
  });

  router.post('/', auth, async (request, response, next) => {
    try {
      const stage = await Stage.create(request.body);
      response.json(stage);
    } catch (error) {
      next(error);
    }
  });

  router.route('/:id')
    .get(async (request, response, next) => {
      const stage = await Stage.findById(request.params.id);
      response.json(stage);
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

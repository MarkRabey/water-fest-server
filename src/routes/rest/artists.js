import express from 'express';
import Artist from '../../models/Artist';
import auth from '../../middleware/auth';

export default () => {
  
  const router = express.Router({
    caseSensitive: true,
  });

  /**
   * GET /artists
   */
  router.get('/', async (request, response, next) => {
    try {
      const artists = await Artist.find();
      response.json(artists);
    } catch (error) {
      next(error);
    }
  });

  router.post('/', auth, async (request, response, next) => {
    try {
      const artist = await Artist.create(request.body);
      response.json(artist);
    } catch (error) {
      next(error);
    }
  });

  router.route('/:id')
    .get(async (request, response, next) => {
      const artist = await Artist.findById(request.params.id);
      response.json(artist);
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

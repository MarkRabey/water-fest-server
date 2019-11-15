import express from 'express';
import artistRoutes from './artists';
import stageRoutes from './stages';
import performanceRoutes from './performances';
import resetRoutes from './reset';

export default () => {
  const router = express.Router({
    caseSensitive: true,
  });

  router.use('/artists', artistRoutes());
  router.use('/stages', stageRoutes());
  router.use('/performances', performanceRoutes());
  router.use('/reset', resetRoutes());

  return router;
}
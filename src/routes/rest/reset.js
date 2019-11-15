import express from 'express';

// Models
import Artist from '../../models/Artist';
import Stage from '../../models/Stage';
import Performance from '../../models/Performance';
import User from '../../models/User';

// Data
import artistData from '../../data/artists';
import stageData from '../../data/stages';
import performanceData from '../../data/performances';
import userData from '../../data/users';

export default () => {
  const router = express.Router({
    caseSensitive: true,
  });

  router.get('/', async (req, res, next) => {
    try {
      await Artist.deleteMany({});
      await Stage.deleteMany({});
      await User.deleteMany({});

      Promise.all([
        Promise.all(artistData.map(artist => new Promise((resolve, reject) => {
          Artist.create(artist).then(resolve);
        }))),
        Promise.all(stageData.map(stage => new Promise((resolve, reject) => {
          Stage.create(stage).then(resolve);
        }))),
      ]).then(([ artists, stages ]) => {
        performanceData.map(async performance => {
          try {
            const artist = artists[performance.artistIndex - 1];
            const stage = stages[performance.stageIndex - 1];
            await Performance.create({
              date: performance.date,
              time: performance.time,
              artistId: artist._id,
              stageId: stage._id,
            });
          } catch (error) {
            console.log(error);
          }
        });
      });
      
      // const stages = await Stage.find();
      // console.log(stages);
      // performanceData.forEach(async data => {
      //   console.log(stages[data.stageIndex]);
      // });
      
      userData.forEach(async data => {
        const user = new User(data);
        await user.save();
      });
      
      res.json({
        artists: 'ok',
        stages: 'ok',
        performances: 'ok',
        users: 'ok',
      });
      
    } catch (error) {
      next(error);
    }
  });

  return router;
}
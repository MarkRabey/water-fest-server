import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const PerformanceSchema = new Schema({
  artistId: {
    type: Schema.Types.ObjectId, ref: 'artist'
  },
  stageId: {
    type: Schema.Types.ObjectId, ref: 'stage'
  },
  date: {
    type: String,
  },
  time: {
    type: String,
  }
});


export default mongoose.model('performance', PerformanceSchema);
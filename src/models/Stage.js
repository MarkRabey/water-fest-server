import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const StageSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  details: {
    type: String,
  },
});

export default mongoose.model('stage', StageSchema);
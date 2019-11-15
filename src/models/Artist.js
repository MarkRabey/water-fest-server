import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ArtistSchema = new Schema({
  name : {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  bio: {
    type: String,
  },
  twitter: {
    type: String,
  },
  facebook: {
    type: String,
  },
  instagram: {
    type: String,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('artist', ArtistSchema);
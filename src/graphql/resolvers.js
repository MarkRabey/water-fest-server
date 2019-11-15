import Artist from '../models/Artist';
import Stage from '../models/Stage';
import Performance from '../models/Performance';
import { verifyJwt } from '../utils/verifyJwt';

export const resolvers = {
  Query: {
    async artist(root, {_id}) {
      return await Artist.findById(_id);
    },
    async artists() {
      return await Artist.find();
    },
    async stage(root, {_id}) {
      return await Stage.findById(_id);
    },
    async stages() {
      return await Stage.find();
    },
    async performance(root, {_id}) {
      return await Performance.findById(_id);
    },
    async performances() {
      return await Performance.find();
    },
    async login(root, { input }, request) {
      const { email, password } = input;
      const user = await User.findByCredentials(email, password);
      return user;
    }
  },
  Mutation: {
    async createArtist(root, { input }, request) {
      try {
        await verifyJwt(request);
        return await Artist.create(input);
      } catch (error) {
        return error;
      }
    },
    async updateArtist(root, {_id, input}){
      
      return await Artist.findByIdAndUpdate(_id, input)
    },
    async deleteArtist(root, {_id}){
      return await Artist.findByIdAndRemove(_id);
    }
  }
};
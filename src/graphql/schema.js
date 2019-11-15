import { makeExecutableSchema } from 'graphql-tools';
import { resolvers } from './resolvers';
const typeDefs = `
  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
  }

  type Artist {
    _id: ID!
    name: String!
    image: String
    bio: String
    twitter: String
    facebook: String
    instagram: String
    dateCreated: Date
  }

  type Stage {
    _id: ID!
    name: String!
  }

  type Performance {
    _id: ID!
    artist: Artist
    stage: Stage
    date: String
    time: String
  }
  
  scalar Date

  type Query {
    artist(_id: ID!): Artist
    artists: [Artist]
    stage(_id: ID!): Stage
    stages: [Stage]
    performance(_id: ID!): Performance
    performances: [Performance]
    login(email: String!, password: String!): User,
  }

  input ArtistInput {
    name: String!
    bio: String
    twitter: String
    facebook: String
    instagram: String
  }

  input ArtistUpdateInput {
    name: String
    bio: String
    twitter: String
    facebook: String
    instagram: String
  }

  type Mutation {
    createArtist(input: ArtistInput) : Artist
    updateArtist(_id: ID!, input: ArtistUpdateInput): Artist
    deleteArtist(_id: ID!): Artist
  }
`;

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

export default schema;
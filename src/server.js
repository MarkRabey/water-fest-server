import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import graphqlHTTP from 'express-graphql';
import passport from 'passport';
import passportConfig from './config/passport';

import schema from './graphql/schema';
import restRoutes from './routes/rest';
import userRoutes from './routes/user';

import dotenv from 'dotenv';

dotenv.config({ silent: process.env.NODE_ENV === 'production' });

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  dbName: process.env.DATABASE_NAME,
}).catch(error => console.log(error));

const app = express();
const PORT = process.env.PORT;

// adding Helmet to enhance your API's security
app.use(helmet());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// Passport middleware
app.use(passport.initialize());
// Passport config
passportConfig(passport);

app.get('/', (req, res) => {
  res.json({
    status: 200,
    message: `WaterFest API v0.1.0`,
  });
});

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}))

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(bodyParser.json());

app.use('/rest', restRoutes());
app.use('/users', userRoutes());

app.listen(PORT, () => {
  console.log(`Server is on port ${ PORT }`);
});

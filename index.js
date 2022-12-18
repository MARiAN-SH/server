import express from 'express';
import logger from 'morgan';

import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import postRouter from './routes/posts.js';
import userRouter from './routes/users.js';
import weatherRouter from './routes/weather.js';

import { writesQueryMiddleware } from './middleware/quvery.js';
const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;


const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';
app.use(logger(formatsLogger));

app.use((req, res, next) => {
  writesQueryMiddleware(req);
  next();
});

app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

app.get('/', (req, res) => {
  res.send('APP IS RUNNING');
});

app.use('/posts', postRouter);
app.use('/user', userRouter);
app.use('/weather', weatherRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found 404' });
});


mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server Running on Port: http://localhost:${PORT}`)
    )
  )
  .catch(error => console.log(`${error} did not connect`));

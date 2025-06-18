import dotenv from 'dotenv';
import express from 'express';
import { AppDataSource } from './data-source';
import { feedRouter } from './routes/feed.routes';
import { postRouter } from './routes/post.routes';
import { userRouter } from './routes/user.routes';

dotenv.config();

const app = express();
app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });

app.get('/', (req, res) => {
  res.send('Welcome to the Social Media Platform API! Server is running successfully.');
});

app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/feed', feedRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

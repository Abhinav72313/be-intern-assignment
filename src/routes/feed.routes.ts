import { Router } from 'express';
import { PostController } from '../controllers/post.controller';

export const feedRouter = Router();
const postController = new PostController();

// Get user's personalized feed
feedRouter.get('/:userId', postController.getFeed.bind(postController));

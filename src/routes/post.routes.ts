import { Router } from 'express';
import { PostController } from '../controllers/post.controller';
import { validate } from '../middleware/validation.middleware';
import { createPostSchema, updatePostSchema } from '../validations/post.validation';

export const postRouter = Router();
const postController = new PostController();

// Get all posts
postRouter.get('/', postController.getAllPosts.bind(postController));

// Get post by id
postRouter.get('/:id', postController.getPostById.bind(postController));

// Create new post
postRouter.post('/', validate(createPostSchema), postController.createPost.bind(postController));

// Update post
postRouter.put('/:id', validate(updatePostSchema), postController.updatePost.bind(postController));

// Delete post
postRouter.delete('/:id', postController.deletePost.bind(postController));

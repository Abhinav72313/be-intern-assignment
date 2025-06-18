import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Follow } from '../entities/Follow';
import { Post } from '../entities/Post';

export class PostController {
  private postRepository = AppDataSource.getRepository(Post);
  private followRepository = AppDataSource.getRepository(Follow);

  async getAllPosts(req: Request, res: Response) {
    try {
      const { limit = 10, offset = 0 } = req.query;
      const posts = await this.postRepository.find({
        relations: ['author', 'likes', 'hashtags'],
        order: { createdAt: 'DESC' },
        take: Number(limit),
        skip: Number(offset),
      });

      // Add like count to each post
      const postsWithLikeCount = posts.map(post => ({
        ...post,
        likeCount: post.likes?.length || 0,
      }));

      res.json(postsWithLikeCount);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching posts', error });
    }
  }

  async getPostById(req: Request, res: Response) {
    try {
      const post = await this.postRepository.findOne({
        where: { id: parseInt(req.params.id) },
        relations: ['author', 'likes', 'hashtags'],
      });

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const postWithLikeCount = {
        ...post,
        likeCount: post.likes?.length || 0,
      };

      res.json(postWithLikeCount);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching post', error });
    }
  }    
  
  async createPost(req: Request, res: Response) {
    try {
      const post = this.postRepository.create(req.body);
      const result = await this.postRepository.save(post);
      
      // Ensure result is a single Post entity
      const savedPost = Array.isArray(result) ? result[0] : result;
      
      // Fetch the complete post with relations
      const completePost = await this.postRepository.findOne({
        where: { id: savedPost.id },
        relations: ['author', 'likes', 'hashtags'],
      });

      res.status(201).json({
        ...completePost,
        likeCount: 0,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error creating post', error });
    }
  }

  async updatePost(req: Request, res: Response) {
    try {
      const post = await this.postRepository.findOne({
        where: { id: parseInt(req.params.id) },
        relations: ['author', 'likes', 'hashtags'],
      });

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      this.postRepository.merge(post, req.body);
      const result = await this.postRepository.save(post);

      const postWithLikeCount = {
        ...result,
        likeCount: result.likes?.length || 0,
      };

      res.json(postWithLikeCount);
    } catch (error) {
      res.status(500).json({ message: 'Error updating post', error });
    }
  }

  async deletePost(req: Request, res: Response) {
    try {
      const result = await this.postRepository.delete(parseInt(req.params.id));
      if (result.affected === 0) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting post', error });
    }
  }

  async getFeed(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { limit = 10, offset = 0 } = req.query;

      // Get users that the current user follows
      const follows = await this.followRepository.find({
        where: { followerId: parseInt(userId) },
        select: ['followingId'],
      });

      const followingIds = follows.map(follow => follow.followingId);

      if (followingIds.length === 0) {
        return res.json([]);
      }

      // Get posts from followed users
      const posts = await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.author', 'author')
        .leftJoinAndSelect('post.likes', 'likes')
        .leftJoinAndSelect('post.hashtags', 'hashtags')
        .where('post.authorId IN (:...followingIds)', { followingIds })
        .orderBy('post.createdAt', 'DESC')
        .take(Number(limit))
        .skip(Number(offset))
        .getMany();

      // Add like count to each post
      const postsWithLikeCount = posts.map(post => ({
        ...post,
        likeCount: post.likes?.length || 0,
      }));

      res.json(postsWithLikeCount);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching feed', error });
    }
  }
}

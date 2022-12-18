import express from 'express';

import {
  getPostsBySearch,
  getPosts,
  getOnePost,
  createPost,
  updatePost,
  addLikeForPost,
  addCommentForPost,
  deletePost,
} from '../controllers/posts.js';

import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/search', getPostsBySearch);

router.get('/', getPosts);
router.get('/:id', getOnePost);

router.post('/', authMiddleware, createPost);
// router.get('/:id', getPosts);
router.patch('/:id', authMiddleware, updatePost);
router.patch('/:id/like_post', authMiddleware, addLikeForPost);
router.post('/:id/comment_post', authMiddleware, addCommentForPost);
router.delete('/:id', authMiddleware, deletePost);

export default router;

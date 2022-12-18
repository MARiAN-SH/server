import express from 'express';
import mongoose from 'mongoose';

import PostMessage from '../models/postMessage.js';

// export const getPosts = async (req, res) => {
//   try {
//     const postMessage = await PostMessage.find();
//     res.status(200).json(postMessage);
//   } catch (e) {
//     res.status(404).json({ message: e.message });
//   }
// };

// get posts of total pages
export const getPosts = async (req, res) => {
  const { page } = req.query;
  try {
    const LIMIT = 4; // The number of posts on the page ;
    const startIndex = (Number(page) - 1) * LIMIT; //get the starting index of every page ;
    const total = await PostMessage.countDocuments({});

    const posts = await PostMessage.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    res.status(200).json({
      data: posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

export const getOnePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await PostMessage.findById(id);

    res.status(200).json(post);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

// QUERY -> /posts?page -> page = 1
// PARAMS -> /posts/123 -> id = 123
export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;
  // console.log(searchQuery);
  try {
    const title = new RegExp(searchQuery, 'i');
    const posts = await PostMessage.find({
      $or: [{ title }, { tags: { $in: tags.split(',') } }],
    });
    res.status(200).json({ data: posts });
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

export const createPost = async (req, res) => {
  const post = req.body;

  const newPostMessage = new PostMessage({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });

  try {
    await newPostMessage.save();

    res.status(201).json(newPostMessage);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const post = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const updatedPost = await PostMessage.findByIdAndUpdate(
    id,
    { ...post, id }, //!!!!!!!
    {
      new: true,
    }
  );

  res.json(updatedPost);
};

export const addLikeForPost = async (req, res) => {
  const { id } = req.params;
  console.log(req.userId);
  if (!req.userId) return res.json({ message: 'Unauthenticated' });

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const post = await PostMessage.findById(id);

  const index = post.likes.findIndex(id => id === String(req.userId));
  if (index === -1) {
    // like the post
    post.likes.push(req.userId);
  } else {
    // delete the post
    post.likes = post.likes.filter(id => id !== String(req.userId));
  }

  const updatedPost = await PostMessage.findByIdAndUpdate(
    id,
    post,
    // {
    //   likeCount: post.likeCount + 1,
    // },
    { new: true }
  );
  res.json(updatedPost);
};

export const addCommentForPost = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;

  const post = await PostMessage.findById(id);
  post.comments.push(value);
  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  });

  res.json(updatedPost);
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  await PostMessage.findByIdAndRemove(id);

  res.json(id);
};

const { UniqueConstraintError, ValidationError } = require('sequelize');
const { sequelize, User, Post } = require('../models');

function handleError(res, err) {
  if (err instanceof UniqueConstraintError) {
    return res.status(409).json({ error: 'Email already exists' });
  }
  if (err instanceof ValidationError) {
    return res.status(400).json({ error: err.errors.map(e => e.message).join(', ') });
  }
  res.status(500).json({ error: err.message });
}

// POST /users — create a user, optionally with posts in the same request.
// Runs in a transaction so a bad post never leaves a half-created user.
exports.createUser = async (req, res) => {
  const { name, email, posts } = req.body;
  if (posts !== undefined && !Array.isArray(posts)) {
    return res.status(400).json({ error: 'posts must be an array' });
  }
  try {
    const user = await sequelize.transaction(t => {
      if (!posts) return User.create({ name, email }, { transaction: t });
      return User.create(
        { name, email, posts },
        { include: [{ model: Post, as: 'posts' }], transaction: t }
      );
    });
    res.status(201).json(user);
  } catch (err) {
    handleError(res, err);
  }
};

// POST /users/:id/posts — create a post that belongs to an existing user
exports.createPostForUser = async (req, res) => {
  const { title, content } = req.body;
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const post = await user.createPost({ title, content });
    res.status(201).json(post);
  } catch (err) {
    handleError(res, err);
  }
};

// GET /users — all users with their posts
exports.getUsersWithPosts = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{ model: Post, as: 'posts' }],
      order: [['id', 'ASC'], [{ model: Post, as: 'posts' }, 'id', 'ASC']],
    });
    res.json(users);
  } catch (err) {
    handleError(res, err);
  }
};

// GET /users/:id — one user with their posts
exports.getUserWithPosts = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{ model: Post, as: 'posts' }],
      order: [[{ model: Post, as: 'posts' }, 'id', 'ASC']],
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    handleError(res, err);
  }
};

// GET /users/:id/posts — only the posts of one user
exports.getPostsOfUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const posts = await user.getPosts({ order: [['id', 'ASC']] });
    res.json(posts);
  } catch (err) {
    handleError(res, err);
  }
};

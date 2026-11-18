const { User, Post } = require('../models');

// GET /posts — all posts with their author (the belongsTo side)
exports.getPostsWithUser = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
      order: [['id', 'ASC']],
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

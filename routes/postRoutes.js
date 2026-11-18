const express = require('express');
const posts = require('../controllers/postController');

const router = express.Router();

router.get('/', posts.getPostsWithUser);

module.exports = router;

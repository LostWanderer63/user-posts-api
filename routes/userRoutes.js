const express = require('express');
const users = require('../controllers/userController');

const router = express.Router();

router.post('/', users.createUser);
router.get('/', users.getUsersWithPosts);
router.get('/:id', users.getUserWithPosts);
router.post('/:id/posts', users.createPostForUser);
router.get('/:id/posts', users.getPostsOfUser);

module.exports = router;

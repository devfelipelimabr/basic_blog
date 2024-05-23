// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddlewares');

// GET /posts - List all posts (all users)
router.get('/', postController.index);

// GET /posts/:id - Get details of a post (all users)
router.get('/:id', postController.show);

// POST /posts - Create a new post (writer)
router.post('/', authMiddleware.writerMiddleware, postController.store);

// PUT /posts/:id - Update a post (writer)
router.put('/:id', authMiddleware.writerMiddleware, postController.update); // Check if the post belongs to the writer

// DELETE /posts/:id - Delete a post (writer)
router.delete('/:id', authMiddleware.writerMiddleware, postController.destroy); // Check if the post belongs to the writer

module.exports = router;

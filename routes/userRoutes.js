// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddlewares');

// POST api/users/login - User login (all users)
router.post('/login', userController.login);

// POST api/users/logout - User logout (all users)
// router.post('/logout', userController.logout);

// POST api/users - Create a new user (open)
router.post('/', authMiddleware.nextMiddleware, userController.store);

// GET api/users - List all users (admin)
router.get('/', authMiddleware.adminMiddleware, userController.index);

// GET api/users/:id - Get details of a user (admin or the user itself)
router.get('/:id', authMiddleware.userMiddleware, userController.show); // Check if the user ID is the same as the session or if it is admin

// PUT api/users/:id - Atualizar um usuário (admin ou o próprio usuário)
router.put('/:id', authMiddleware.userMiddleware, userController.update); // Check if the user ID is the same as the session or if it is admin

// DELETE api/users/:id - Delete a user (admin)
router.delete('/:id', authMiddleware.adminMiddleware, userController.destroy);

module.exports = router;

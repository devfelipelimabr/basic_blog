// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddlewares');

// GET /categories - Listar todas as categorias (aberto)
router.get('/', categoryController.index);

// GET /categories/:id - Obter detalhes de uma categoria (aberto)
router.get('/:id', categoryController.show);

// POST /categories - Criar uma nova categoria (admin)
router.post('/', authMiddleware.adminMiddleware, categoryController.store);

// PUT /categories/:id - Atualizar uma categoria (admin)
router.put('/:id', authMiddleware.adminMiddleware, categoryController.update);

// DELETE /categories/:id - Excluir uma categoria (admin)
router.delete('/:id', authMiddleware.adminMiddleware, categoryController.destroy);

module.exports = router;

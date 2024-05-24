// controllers/postController.js
const Post = require('../models/Post');
const User = require('../models/User');
const Category = require('../models/Category');
const { checkRole } = require('../utils/utilMethods');

module.exports = {
  async index(req, res) {
    const page = parseInt(req.query.page, 10) || 1;
    let limit = parseInt(req.query.limit, 10) || 10;
    const categoryId = parseInt(req.query.category, 10); // Obter o ID da categoria (se existir)

    // Garantir que o limite esteja entre 1 e 50
    if (limit < 1) limit = 1;
    if (limit > 50) limit = 50;

    const offset = (page - 1) * limit;
    // Construção da query (com ou sem filtro por categoria)
    const whereClause = {};
    if (Number.isInteger(categoryId)) {

      // Verificar se a categoria existe
      const categoryExists = await Category.findByPk(categoryId);
      if (!categoryExists) return res.status(404).json({ error: 'Category not found' });

      whereClause.CategoryId = categoryId
    }

    const posts = await Post.findAndCountAll({
      include: [
        { model: User, attributes: ['name'] },
        { model: Category, attributes: ['name'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: limit,
      offset: offset,
      where: whereClause // Adicionar a cláusula WHERE (se houver)
    });

    res.status(200).json({
      posts: posts.rows,
      currentPage: page,
      totalPages: Math.ceil(posts.count / limit)
    });
  },

  async show(req, res) {
    const postId = req.params.id;
    if (!postId || !Number.isInteger(parseInt(postId, 10))) {
      return res.status(400).json({ error: 'Invalid post ID.' });
    }

    const post = await Post.findByPk(postId, {
      include: [
        { model: User, attributes: ['name'] },
        { model: Category, attributes: ['name'] }
      ]
    });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.status(200).json(post);
  },

  async store(req, res) {
    const { title, content, image, categoryId } = req.body;
    const authorId = req.user.id;

    try {
      const user = await User.findByPk(authorId);
      const category = await Category.findByPk(categoryId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      const post = await Post.create({ title, content, image, UserId: authorId, CategoryId: categoryId });
      res.status(200).json(post);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async update(req, res) {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (req.user.id != post.UserId && req.user.role != 'admin')
      return res.status(400).json({ error: 'Only an administrator or the author of the post can make this request' });

    const { title, content, image, categoryId } = req.body;

    try {
      if (categoryId) {
        const category = await Category.findByPk(categoryId);
        if (!category) return res.status(404).json({ error: 'Category not found' });
      }

      await post.update({ title, content, image, CategoryId: categoryId });
      res.status(200).json(post);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async destroy(req, res) {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (req.user.id != post.UserId && req.user.role != 'admin')
      return res.status(400).json({ error: 'Only an administrator or the author of the post can make this request' });

    if (post) await post.destroy();
    res.status(200).json({ message: 'Post deleted' });
  }
};

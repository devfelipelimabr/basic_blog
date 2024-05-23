// controllers/postController.js
const Post = require('../models/Post');
const User = require('../models/User');
const Category = require('../models/Category');
const { checkRole } = require('../utils/utilMethods');

module.exports = {
  async index(req, res) {
    const posts = await Post.findAll({
      include: [
        { model: User, attributes: ['name'] },
        { model: Category, attributes: ['name'] }],
      order: [['createdAt', 'DESC']]
    }); // Includes relationships with User and Category
    res.status(200).json(posts);
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
    }); // Includes relationships with User and Category
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.status(200).json(post);
  },

  async store(req, res) {
    const { title, content, image, categoryId } = req.body;
    const authorId = req.session.userId;

    try {
      // Check if the user and category exist
      const user = await User.findByPk(authorId);
      const category = await Category.findByPk(categoryId);
      if (!user || !category) {
        return res.status(404).json({ error: 'User or Category not found' });
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
    if (req.session.userId != post.UserId && (await checkRole(req.session.userId)) != 'admin')
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
    if (req.session.userId != post.UserId && (await checkRole(req.session.userId)) != 'admin')
      return res.status(400).json({ error: 'Only an administrator or the author of the post can make this request' });

    if (post)

      await post.destroy();
    res.status(200).json({ message: 'Post deleted' });
  }
};

// controllers/categoryController.js
const Category = require('../models/Category');

module.exports = {
  async index(req, res) {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  },

  async show(req, res) {
    const catId = req.params.id;
    if (!catId || !Number.isInteger(parseInt(catId, 10))) {
      return res.status(400).json({ error: 'Invalid post ID.' });
    }

    const category = await Category.findByPk(catId);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.status(200).json(category);
  },

  async store(req, res) {
    const { name } = req.body;

    if (!name) return res.status(400).json({ error: 'Category name not provided' });
    if (name.length > 20) return res.status(400).json({ error: 'Category name must have a maximum of 20 characters' });

    try {
      const category = await Category.create({ name });
      res.status(200).json({ message: `Category - ${category.name} - was created successfully` });
    } catch (error) {
      // Checks if the error is a duplicate key (unique constraint)
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ error: 'Category name already exists' });
      }
      res.status(400).json({ error: error.message });
    }
  },

  async update(req, res) {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Category name not provided' });
    if (name.length > 20) return res.status(400).json({ error: 'Category name must have a maximum of 20 characters' });

    try {
      await category.update({ name });
      res.status(200).json(category);
    } catch (error) {
      // Checks if the error is a duplicate key (unique constraint)
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ error: 'Category name already exists' });
      }
      res.status(400).json({ error: error.message });
    }
  },

  async destroy(req, res) {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    await category.destroy();
    res.status(200).json({ message: 'Category deleted' });
  }
};

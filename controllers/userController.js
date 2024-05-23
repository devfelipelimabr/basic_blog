// controllers/userController.js
const { error } = require('console');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { validatePassword, checkEmailUnique, checkRole } = require('../utils/utilMethods');

module.exports = {
  async index(req, res) {
    const users = await User.findAll();
    res.status(200).json(users);
  },

  async show(req, res) {
    const userId = req.params.id;
    if (!userId || !Number.isInteger(parseInt(userId, 10))) {
      return res.status(400).json({ error: 'Invalid user ID.' });
    }

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  },

  async store(req, res) {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) return res.status(400).json({ error: 'Mandatory fields not filled in' });

    try {
      // Single email validation
      await checkEmailUnique(email);
      // Password validation
      validatePassword(password);

      const lowerName = name.toLowerCase();
      const lowerEmail = email.toLowerCase();

      const hashedPassword = await bcrypt.hash(password, 8);

      let user;

      if (req.session.userId && (await checkRole(req.session.userId)) == 'admin') {
        let lowerRole;
        role ? lowerRole = role.toLowerCase() : lowerRole = 'subscriber';
        user = await User.create({ name: lowerName, email: lowerEmail, password: hashedPassword, role: lowerRole });
      } else {
        user = await User.create({ name: lowerName, email: lowerEmail, password: hashedPassword, role: 'subscriber' });
      }

      res.status(200).json({ message: 'User created' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async update(req, res) {
    const user = await User.findByPk(req.params.id);

    if (!user) return res.status(404).json({ error: 'User not found' });

    const { name, email, password, role } = req.body;

    try {
      if (password) {
        // Validação da senha
        validatePassword(password);
        const hashedPassword = await bcrypt.hash(password, 8);
        req.body.password = hashedPassword;
      }
      if (name) {
        req.body.name = name.toLowerCase();
      }
      if (email) {
        // Single email validation
        await checkEmailUnique(email);
        req.body.email = email.toLowerCase();
      }
      if (role && (await checkRole(req.session.userId)) == 'admin') {
        req.body.role = role.toLowerCase();
      } else {
        req.body.role = user.role;
      }

      await user.update(req.body);
      res.status(200).json({ message: 'User updated' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async destroy(req, res) {
    if (req.params.id == req.session.userId) return res.status(400).json({ error: 'User cannot self-delete' });
    
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.destroy();
    res.status(200).json({ message: 'User deleted' });
  },

  async login(req, res) {
    const { email, password } = req.body;

    const lowerEmail = email.toLowerCase();

    const user = await User.findOne({ where: { email: lowerEmail } });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    req.session.userId = user.id;
    res.status(200).json({ message: 'Login successful' });
  },

  async logout(req, res) {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ error: 'Logout failed' });
      }
      res.status(200).json({ message: 'Logout successful' });
    });
  }
};

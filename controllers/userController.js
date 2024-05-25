// controllers/userController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validatePassword, checkEmailUnique } = require('../utils/utilMethods');

const generateToken = (user) => {
  const userData = {
    id: user.id,
    role: user.role,
    name: user.name,
    email: user.email
  };

  return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '5d' });
};

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
      await checkEmailUnique(email);
      validatePassword(password);

      const lowerName = name.toLowerCase();
      const lowerEmail = email.toLowerCase();
      const hashedPassword = await bcrypt.hash(password, 8);

      let user;
      if (req.user && req.user.role === 'admin') {
        user = await User.create({ name: lowerName, email: lowerEmail, password: hashedPassword, role: role ? role.toLowerCase() : 'subscriber' });
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
        validatePassword(password);
        req.body.password = await bcrypt.hash(password, 8);
      }
      if (name) req.body.name = name.toLowerCase();
      if (email) {
        await checkEmailUnique(email);
        req.body.email = email.toLowerCase();
      }

      (role && req.user.role === 'admin') ? req.body.role = role.toLowerCase() : req.body.role = req.user.role;


      await user.update(req.body);
      res.status(200).json({ message: 'User updated' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async destroy(req, res) {
    if (req.params.id == req.user.id) return res.status(400).json({ error: 'User cannot self-delete' });

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.destroy();
    res.status(200).json({ message: 'User deleted' });
  },

  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: 'Email or password not provided' });

    const lowerEmail = email.toLowerCase();
    const user = await User.findOne({ where: { email: lowerEmail } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    const userData = {
      id: user.id,
      name: user.name,
      role: user.role,
      email: user.email
    };

    res.status(200).json({ message: 'Login successful', token, user: userData });
  }
};

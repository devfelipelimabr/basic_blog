// app.js
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const sequelize = require('./config/database');

const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

// Middlewares
app.use(express.json());
app.use(helmet());

// Connection to the database
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection to the database established successfully');
    })
    .catch(err => {
        console.error('Error connecting to database: ', err);
    });

// API Routes
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);

// Validation error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof validationResult.Result) {
        return res.status(422).json({ errors: err.array() });
    }
    next(err);
});

// 404 (Not Found) error handling
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
});

// Server startup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on the port ${PORT}`);
});

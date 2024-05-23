// config/database.js

require('dotenv').config(); // Load environment variables from .env file
const { Sequelize } = require('sequelize');

// Extract environment variables
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

// Database configuration for PostgreSQL
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'postgres', // Mudança para 'postgres'
  port: DB_PORT,
  dialectOptions: {
    ssl: process.env.DB_SSL === 'true' // Enable SSL if DB_SSL is true
  },
  logging: true // Disable Sequelize logs (optional)
});

// Test database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database successful.');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
})();

module.exports = sequelize;

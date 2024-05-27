// config/create-db.js

require('dotenv').config();

const sequelize = require('./config/database');
const path = require('path');
const fs = require('fs');

// Inicializar um objeto vazio para armazenar os modelos
const db = {};

// Ler os arquivos de modelo do diretório models
const modelsDir = path.join(__dirname, './models');
fs.readdirSync(modelsDir)
  .filter(file => file.endsWith('.js') && file !== 'index.js')
  .forEach(file => {
    const modelPath = path.join(modelsDir, file);
    const model = require(modelPath);
    db[model.name] = model;
  });

// Definir associações entre os modelos, se necessário
Object.values(db).forEach(model => {
  if (model.associate) {
    model.associate(db);
  }
});

// Sincronizar o banco de dados com os modelos
(async () => {
  try {
    await sequelize.sync({ force: true }); // Use { force: true } apenas em ambiente de desenvolvimento
    console.log('Banco de dados sincronizado com sucesso.');
  } catch (error) {
    console.error('Erro ao sincronizar o banco de dados:', error);
  }
})();

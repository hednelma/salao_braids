const Sequelize = require('sequelize')

// Configuração do Sequelize para conexão com o banco de dados SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite' // Caminho onde o arquivo do banco será salvo
})

module.exports = {
  Sequelize: Sequelize,
  sequelize: sequelize
}
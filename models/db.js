const Sequelize = require('sequelize')

// Configuração do Sequelize para conexão com o banco de dados MySQL
const sequelize = new Sequelize('salao', 'salao', 'salao100%', {
  host: 'localhost',
  dialect: 'mysql'
})

module.exports = {
    Sequelize: Sequelize,
    sequelize:sequelize
}

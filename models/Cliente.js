const { toDefaultValue } = require('sequelize/lib/utils')
const db = require('./db')


const Clientes = db.sequelize.define('clientes',{

    nome: {
        type:db.Sequelize.STRING,
        allowNull: false

    },

    nomeutilizador: {
        type:db.Sequelize.STRING,
        allowNull: false

    },

    telefone: {
        type:db.Sequelize.STRING,
    },

    email: {
        type:db.Sequelize.STRING,
        allowNull: false
    },

    senha: {
        type:db.Sequelize.STRING,
        allowNull: false

    },
    
    foto: {
        type:db.Sequelize.TEXT,
    },

    role: {
        type:db.Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 2
    }
    
})

//Clientes.sync({alter:true})

module.exports = Clientes
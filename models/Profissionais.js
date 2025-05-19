const db = require('./db')


const Profissionais = db.sequelize.define('profissionais',{

    nome: {
        type:db.Sequelize.STRING,
        allowNull: false

    },

    especialidade: {
        type:db.Sequelize.STRING,
        allowNull: false

    },

    telefone: {
        type:db.Sequelize.STRING,
        allowNull: false

    },

    email: {
        type:db.Sequelize.STRING,
        allowNull: false

    },
    
    foto: {
        type:db.Sequelize.STRING,
        allowNull: false

    },

    
})
//Profissionais.sync({force:true})

module.exports = Profissionais
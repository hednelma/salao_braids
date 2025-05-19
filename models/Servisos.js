const db = require('./db')


const Servicos = db.sequelize.define('servicos',{

    nome: {
        type:db.Sequelize.STRING,
        allowNull: false

    },

    descricao: {
        type:db.Sequelize.STRING,
        allowNull: false

    },

    duracao: {
        type:db.Sequelize.STRING,
        allowNull: false

    },

    preco: {
        type:db.Sequelize.STRING,
        allowNull: false

    },

    imagem: {
        type:db.Sequelize.STRING,
        allowNull: false

    },
    

    
})

//Servicos.sync({alter:true})

module.exports = Servicos
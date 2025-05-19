const Clientes = require('./Cliente')
const db = require('./db')
const Profissionais = require('./Profissionais')
const Servicos = require('./Servisos')


const Avaliacao = db.sequelize.define('avaliacoes',{

    clienteId: {
        type: db.Sequelize.INTEGER,
        references: {
            model: Clientes,
            key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE'
    },

     profissionalId: {
            type: db.Sequelize.INTEGER,
            references: {
                model: Profissionais,
                key: 'id'
            },
            allowNull: false,
            onDelete: 'CASCADE'
        },
    
        servicoId: {
            type: db.Sequelize.INTEGER,
            references: {
                model: Servicos,
                key: 'id'
            },
            allowNull: false,
            onDelete: 'CASCADE'
        },


})
//Avaliacao.sync({force:true})

module.exports = Avaliacao
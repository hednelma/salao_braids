const Clientes = require('./Cliente')
const db = require('./db')
const Servicos = require('./Servisos')

const Avaliacao = db.sequelize.define('avaliacoes', {

    clientId: {
        type: db.Sequelize.INTEGER,
        references: {
            model: Clientes,
            key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE'
    },

    professionalId: {
        type: db.Sequelize.INTEGER,
        references: {
            model: Clientes,
            key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE'
    },

    serviceId: {
        type: db.Sequelize.INTEGER,
        references: {
            model: Servicos,
            key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE'
    },

    rating: {
        type: db.Sequelize.INTEGER,
        allowNull: false
    },

    comments: {
        type: db.Sequelize.STRING,
        allowNull: false
    },

})

// Associations with Clientes (as client)
Clientes.hasMany(Avaliacao, { foreignKey: 'clientId', as: 'clientAvaliacaos', onDelete: 'CASCADE' })
Avaliacao.belongsTo(Clientes, { foreignKey: 'clientId', as: 'client' })

// Associations with Clientes (as professional)
Clientes.hasMany(Avaliacao, { foreignKey: 'professionalId', as: 'professionalAvaliacaos', onDelete: 'CASCADE' })
Avaliacao.belongsTo(Clientes, { foreignKey: 'professionalId', as: 'professional' })

// Associations with Service
Servicos.hasMany(Avaliacao, { foreignKey: 'serviceId', as: 'Avaliacaos', onDelete: 'CASCADE' })
Avaliacao.belongsTo(Servicos, { foreignKey: 'serviceId', as: 'service' })

//Avaliacao.sync({ alter: true })
module.exports = Avaliacao
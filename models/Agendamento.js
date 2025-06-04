const Clientes = require('./Cliente')
const db = require('./db')
const Servicos = require('./Servisos')


const Agendamento = db.sequelize.define('agendamentos', {

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
            model: Clientes,
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

    data_hora: {
        type: db.Sequelize.STRING,
        allowNull: false

    },
// o agendamento pode estar realizado ou por realizar
    status: {
        type: db.Sequelize.STRING,
        allowNull: false

    },
})


// Associações com os cliente 
// ele vai pegar o Id do cliente e  com este Id ele ja pega todos os agendamentos do cliente
Clientes.hasMany(Agendamento, {foreignKey: 'clienteId', as: 'clienteAgendamentos', onDelete: 'CASCADE'})
Agendamento.belongsTo(Clientes, {foreignKey: 'clienteId', as: 'client'})


Clientes.hasMany(Agendamento, { foreignKey: 'profissionalId', as: 'professionalAgendamentos', onDelete: 'CASCADE'})
Agendamento.belongsTo(Clientes, { foreignKey: 'profissionalId', as: 'professional'})


Servicos.hasMany(Agendamento, { foreignKey: 'servicoId', as: 'Agendamentos',  onDelete: 'CASCADE'})
Agendamento.belongsTo(Servicos, { foreignKey: 'servicoId', as: 'servico'})



//Agendamento.sync({ alter: true })

module.exports = Agendamento
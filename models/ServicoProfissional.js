const db = require("./db");
const Clientes = require("./Cliente");
const Servicos = require("./Servisos");



const ServicoProfissional = db.sequelize.define('ServicoProfissional', {

    profissionalId: {
        type: db.Sequelize.INTEGER,
        references: {
            model: Clientes,
            key: 'id',
        }


    },


    ServicoId: {
        type: db.Sequelize.INTEGER,
        references: {
            model: Servicos,
            key: 'id',
        }


    },



})


Clientes.belongsToMany(Servicos, {
    through: ServicoProfissional,
    foreignKey: 'profissionalId',
    as: 'servicos'
})

Servicos.belongsToMany(Clientes, {
    through: ServicoProfissional,
    foreignKey: 'ServicoId',
    as: 'profissionais'
})

ServicoProfissional.belongsTo(Clientes, {
    foreignKey: 'profissionalId',
    as: 'professional'
})

ServicoProfissional.belongsTo(Servicos, {
    foreignKey: 'ServicoId',
    as: 'Servico'
})

Clientes.hasMany(ServicoProfissional, {
    foreignKey: 'profissionalId',
    as: 'professionalServices'
})

Servicos.hasMany(ServicoProfissional, {
    foreignKey: 'ServicoId',
    as: 'profssionalServicos'
})





//ServicoProfissional.sync({force:true})

module.exports = ServicoProfissional
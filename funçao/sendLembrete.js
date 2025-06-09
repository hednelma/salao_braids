const { Op } = require('sequelize')
const Appointment = require('./../models/Agendamento')
const User = require('../models/Cliente')
const Email = require('./../email/senderMailAppointment')
const Servicos = require('../models/Servisos')

const buscarTodosAgendamentosDoDia = async () => {

    try {

        const hoje = new Date().toISOString().split('T')[0]

        const agendamentosHoje = await Appointment.findAll({
            include: [
                {
                    model: User,
                    as: 'client',
                    attributes: ['id', 'nome', 'email']
                },
                {
                    model: User,
                    as: 'professional',
                    attributes: ['id', 'nome', 'email']
                },
                {
                    model: Servicos,
                    as: 'servico',
                    attributes: ['id', 'nome']

                }
            ],
            where: { data_hora: { [Op.like]: `${hoje}%` } }
        })

        return agendamentosHoje

    } catch (error) {
        console.log('Erro ao buscar agendamentos:', error)
    }

}

const lembretesToSends = async (lembretesToSend) => {

    for (const lembrete of lembretesToSend) {

        const dataAgendamento = new Date(lembrete.data_hora.replace(' ', 'T'))
        const agora = new Date()

        const diferencaMinutos = Math.floor((dataAgendamento.getTime() - agora.getTime()) / (1000 * 60))
        console.log(`Diferença é de: ${diferencaMinutos}`)

        // Verifica se deve enviar lembrete de 30 minutos
        if (diferencaMinutos === 30) {
            await Email.enviarEmail(lembrete.client, lembrete.data_hora.split(' ')[1], lembrete.servico, lembrete.professional)
        }

        // Verifica se deve enviar lembrete de 20 minutos
        if (diferencaMinutos === 20) {
            await Email.enviarEmail(lembrete.client, lembrete.data_hora.split(' ')[1], lembrete.servico, lembrete.professional)
      
        }
    }
}

const sendLembretes = async () => {
    try {
        const lembretes = await buscarTodosAgendamentosDoDia()

        lembretesToSends(lembretes)
    } catch (error) {
        console.log("Ocorreu um erro inesperado")
    }
}

module.exports = { sendLembretes }
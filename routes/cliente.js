const express = require('express')
const routes = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Cliente = require('../models/Cliente')
const { Op } = require('sequelize')
const verifyUserNameToEdit = require('../funçao/verifyUserNameToEdit')
const Clientes = require('../models/Cliente')
const Agendamento = require('../models/Agendamento')
const Servicos = require('../models/Servisos')
const ServicoProfissional = require('../models/ServicoProfissional')
const Avaliacao = require('../models/Avaliacoes')



const UPLOADS_DIR = path.join(__dirname, 'uploads')

routes.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Garantir que a pasta uploads exista
const uploadDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir)
}

// Configuração do Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`
        cb(null, filename)
    }
})

const upload = multer({ storage })


routes.put('/edit/my/photo/:userId', upload.single('photo'), async (req, res) => {
    try {


        if (!req.file) {
            console.log('Nenhuma imagem foi enviada.')
            return res.status(400).json({ message: 'Nenhuma imagem foi enviada.' })
        }

        const userId = req.params.userId

        // Busca o usuário no banco
        const user = await Cliente.findByPk(userId)
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' })
        }

        // Caminho da nova imagem
        const newAvatarPath = `/uploads/${req.file.filename}`

        const imagePath = user.foto

        if (imagePath) {

            const fullImagePath = path.join(UPLOADS_DIR, path.basename(imagePath))


            if (fs.existsSync(fullImagePath)) {
                fs.unlinkSync(fullImagePath)
            }
        }



        // Atualiza apenas o campo avatar
        user.foto = newAvatarPath
        await user.save()

        res.status(200).json({ message: "Avatar atualizado com sucesso!", foto: user.foto })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Erro ao atualizar avatar." })
    }
})



routes.put('/edit/my/name/:userId', async (req, res) => {
    try {
        const { nome } = req.body
        const [updated] = await Cliente.update({ nome }, { where: { id: req.params.userId } })

        if (updated) {
            return res.status(200).json({ message: "Nome atualizado com sucesso!" })
        } else {
            return res.status(404).json({ message: "Usuário não encontrado" })
        }

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Erro ao atualizar nome" })
    }
})

routes.put('/edit/my/nomeutilizador/:userId', async (req, res) => {
    try {
        const { nomeutilizador } = req.body

        const existUserName = await verifyUserNameToEdit(nomeutilizador)

        if (existUserName) {
            const [updated] = await Cliente.update({ nomeutilizador }, { where: { id: req.params.userId } })

            if (updated) {
                res.status(200).json({ message: "Nome do utilizador atualizado com sucesso!" })
            } else {
                res.status(404).json({ message: "Usuário não encontrado" })
            }
        }

        else
            res.status(401).json({ message: "Esse nome do utilizador está sendo usado por outra pessoa" })


    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Erro ao atualizar nome" })
    }
})


routes.delete('/delete/my/account/:userId', async (req, res) => {
    try {

        const remove = Cliente.destroy({ where: { id: req.params.userId } })
        if (remove)
            res.status(200).json('User removed')
        else
            res.status(404).json('User not found!')

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Erro ao atualizar nome" })
    }
})

// endpoint para remover aendamento
routes.delete('/delete/my/agendamento/:id', async (req, res) => {
    try {
        const agendamento = await Agendamento.destroy({ where: { id: req.params.id } })
        if (agendamento)
            res.status(200).json('Agendamento removido')
        else
            res.status(404).json('Agendamento não encontrado')
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Erro ao remover agendamento" })
    }
})


//endpoint de encontrar Agendamento
routes.get('/encontrar/meus/agendamentos/:clientesId', async (req, res) => {
    try {

        const cliente = await Clientes.findByPk(req.params.clientesId, {
            include: {
                model: Agendamento,
                as: 'clienteAgendamentos',
                attributes: ['id', 'data_hora', 'status', 'clienteId', 'profissionalId', 'servicoId'],
                include: {
                    model: Servicos,
                    as : 'servico',
                    attributes: ['id', 'nome', 'preco', 'duracao', 'imagem'],
                
                }
            }
        })
        if (cliente) {
            res.status(200).json(cliente.clienteAgendamentos)

        } else {
            res.status(400).json({ message: 'Cliente não encontrado' })

        }
    } catch (erro) {
        console.error(erro)
        res.status(500).json({ message: 'Erro ao buscar agendamento' })
    }
})

//endpoint para buscar horario dos agendamentos feitos
routes.get('/buscar/meus/agendamentos/time/profissional/:profissionalId', async (req, res) => {
    try {
        const agendamentos = await Agendamento.findAll({
            where: { profissionalId: req.params.profissionalId },
            attributes: ['id', 'data_hora'],
        })

            res.status(200).json(agendamentos)
        
    } catch (erro) {
        console.error(erro)
        res.status(500).json({ mensagem: "Erro ao buscar agendamentos" })
    }
})

// endpoint de buscar os agendamentos do profissionais
routes.get('/buscar/meus/agendamentos/profissional/:profissionalId', async (req, res) => {
    try {
        const agendamentos = await Agendamento.findAll({
            where: { profissionalId: req.params.profissionalId },
            attributes: ['id', 'data_hora', 'status'],
            include: {
                model: Servicos,
                as: 'servico',
                attributes: ['id', 'nome', 'preco', 'duracao', 'imagem'],
            }
        })

            res.status(200).json(agendamentos)
        
    } catch (erro) {
        console.error(erro)
        res.status(500).json({ mensagem: "Erro ao buscar agendamentos" })
    }
})


// endpoint para fazer Agendamento
routes.post('/fazer/agendamento', async (req, res) => {

    console.log(req.body)

    try {
        const {clienteId, profissionalId, servicoId, data_hora} = req.body
        const agendamento = await Agendamento.create({ clienteId, profissionalId, servicoId, data_hora, status: 'pendente' })
        if (agendamento) {
            res.status(200).json(agendamento)
        } else {
            res.status(404).json({ message: "Erro ao criar agendamento" })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Erro ao criar agendamento" })
    }
})


// endpiont para encontrar todos os servicos de profissional
routes.get('/find/servicos/profissional/:id', async (req, res) => {
    try {
        const { id } = req.params

        const profissional = await Cliente.findByPk(id,{
            attributes: ['id'],
            include: [{
                model: Servicos,
                as: 'servicos',
                attributes: ['id', 'nome', 'duracao', 'preco', 'imagem'],
            }]
        })

        if (profissional?.servicos.length > 0)
            res.status(200).json(profissional?.servicos)
        else
            res.status(200).json({ message: 'Este profissional não possui serviços registados' })

    } catch (error) {
        console.log('Um erro ocorreu: ', error)
        res.status(500).json({ error: 'Ocorreu um erro ao buscar os serviços.' })
    }
})



//endpiont para encontrar todos os profissionais que fazem um serviço
routes.get('/find/profissionais/servico/:id', async (req, res) => {
    try {
        const { id } = req.params

        // Supondo que 'servico' tenha uma associação com 'profissionais'
        const servicoEncontrado = await Servicos.findByPk(id, {
            include: [{
                model: Cliente,
                as: 'profissionais', // ajuste conforme o alias usado na associação
                through: { attributes: [] },// remove dados da tabela intermediária
                attributes: ['id', 'nome', 'foto' ]
            }]
        })

        if (!servicoEncontrado) {
            return res.status(404).json({ message: 'Serviço não encontrado.' })
        }

        if (servicoEncontrado.profissionais && servicoEncontrado.profissionais.length > 0) {
            return res.status(200).json(servicoEncontrado.profissionais)
        } else {
            return res.status(200).json({ message: 'Nenhum profissional encontrado para este serviço.' })
        }

    } catch (error) {
        console.log('Um erro ocorreu: ', error)
        return res.status(500).json({ error: 'Ocorreu um erro ao buscar os profissionais.' })
    }
})


//endpoint de avaliacao
routes.post('/evaluation', async (req, res) => {
    try {
        const { clientId, professionalId, serviceId, rating, comments } = req.body
        const evaluation = await Avaliacao.create({ clientId, professionalId, serviceId, rating, comments })
        res.status(200).json({ message: 'Avaliação realizada com sucesso.' })
    } catch (error) {
        console.log('Um erro ocorreu: ', error)
        res.status(500).json({ error: 'Ocorreu um erro ao realizar a aval iação.' })
    }
})

// Endpoint para buscar avaliacao do profissional
routes.get('/evaluation/:profissionalId', async (req, res) => {

    try {
        const evaluations = await Avaliacao.findAll({
            attributes: ['id', 'rating', 'comments', 'createdAt'],
            include: [
                {
                    model: Cliente,
                    as: 'client',
                    attributes: ['id', 'nome'],
                }
            ],
            where: { professionalId: req.params.profissionalId }
        })
        res.status(200).json(evaluations)

    } catch (error) {
        console.log('Um erro ocorreu: ', error)
        res.status(500).json({ error: 'Ocorreu um erro ao realizar a aval iação.' })
    }
})



module.exports = routes
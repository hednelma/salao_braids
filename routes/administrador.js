const express = require('express')
const routes = express.Router()
const Cliente = require('../models/Cliente')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { Op } = require('sequelize')
const Servicos = require('../models/Servisos')


const UPLOADS_DIR = path.join(__dirname, 'uploads')

routes.use('./uploads', express.static(path.join(__dirname, 'uploads')))


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



routes.get('/find/all/clientes', async (req, res) => {

    console.log("Chegeui aqui....")

    try {
        const clientes = await Cliente.findAll({
            attributes: ['id', 'nome', 'foto', 'role'],
        })

        if (clientes)
            res.status(200).json(clientes)
        else
            res.status(200).json({ message: 'Sem clientes.......' })

    } catch (error) {
        console.log("Chegeui errando aqui....")

    }
})

//--------------------Serviços----------------------------
routes.get('/find/all/services', async (req, res) => {
    try {
        const servico = await Servicos.findAll()
        if (servico)
            res.status(200).json(servico)
        else
            res.status(200).json({ message: 'Não há serviços' })
    } catch (error) {
        console.log('um erro ocorreu, ', error)
    }
})

routes.post('/add/servico', upload.single('imagem'), async (req, res) => {

    console.log("ESESESESESESES")

    try {
        const { nome, descricao, duracao, preco } = req.body

        if (!nome || !duracao || !preco || !descricao) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios!' })
        }

        const imagem = req.file ? `/uploads/${req.file.filename}` : null

        const newServico = await Servicos.create({ nome, descricao, duracao, preco, imagem })

        res.status(200).json(newServico)

    } catch (error) {
        console.error('Erro ao adicionar serviço:', error)
        res.status(500).json({ message: 'Erro interno no servidor.' })
    }
})

routes.put('/edit/servico/:id', upload.single('imagem'), async (req, res) => {
    try {
        const service = await Servicos.findByPk(req.params.id)

        if (!service) {
            return res.status(404).json({ message: 'Comando não encontrado.' })
        }

        const { nome, descricao, preco, duracao, imagem } = req.body

        let newimagem = service.imagem

        if (imagem === 'null') {
            newimagem = null
        } else if (req.file) {
            newimagem = `/uploads/${req.file.filename}`
        }


        if ((imagem === 'null' || req.file) && service.imagem) {
            const oldimagemPath = path.join(UPLOADS_DIR, path.basename(service.imagem))
            if (fs.existsSync(oldimagemPath)) {
                fs.unlinkSync(oldimagemPath)
            }
        }


        const [updatedRows] = await Servicos.update({ nome, descricao, preco, duracao, imagem: newimagem }, { where: { id: req.params.id } })

        if (updatedRows === 0) {
            return res.status(400).json({ error: 'Falha ao atualizar o comando.' })
        }

        const updatedServicos = await Servicos.findByPk(req.params.id)
        return res.status(200).json(updatedServicos)

    } catch (error) {
        console.error('Erro ao editar serviço:', error)
        res.status(500).json({ message: 'Erro interno no servidor.' })
    }
})


routes.delete('/delete/servico/:id', async (req, res) => {
    try {
        const { id } = req.params

        const servico = await Servicos.findByPk(id)
        if (!servico) {
            return res.status(404).json({ message: 'Serviço não encontrado.' })
        }
        // ele pega o caminho da imagem para remover na pasta de upload
        const imagePath = servico.imagem

        if (imagePath) {

            const fullImagePath = path.join(UPLOADS_DIR, path.basename(imagePath))

            if (fs.existsSync(fullImagePath)) {
                fs.unlinkSync(fullImagePath)
            }

        }

        await servico.destroy()

        res.status(200).json({ message: 'Serviço removido com sucesso!' })

    } catch (error) {
        console.error('Erro ao remover serviço:', error)
        res.status(500).json({ message: 'Erro interno no servidor.' })
    }
})




routes.get('/find/all/agendamentos', async (req, res) => {
    try {
        const agendamentos = await Agendamento.findAll()

        if (agendamentos && agendamentos.length > 0) {
            res.status(200).json(agendamentos)
        } else {
            res.status(200).json({ message: 'Nenhum agendamento encontrado.' })
        }
    } catch (error) {
        console.error('Um erro ocorreu ao buscar agendamentos:', error)
        res.status(500).json({ message: 'Erro interno no servidor.' })
    }
})




// listar todos os agendamentos de um usuario
routes.get('/find/agendamentos/usuario/:id', async (req, res) => {
    try {
        const { id } = req.params

        const agendamentos = await agendamento.findAll({
            where: { usuarioId: id }
        })

        if (agendamentos && agendamentos.length > 0)
            res.status(200).json(agendamentos)
        else
            res.status(200).json({ message: 'Este usuário não possui agendamentos' })
    } catch (error) {
        console.log('um erro ocorreu, ', error)
    }
})


// para editar agendamento
routes.put('/agendamento/update/:id', async (req, res) => {
    try {
        const { id } = req.params
        const dadosAtualizados = req.body

        const [updated] = await agendamento.update(dadosAtualizados, {
            where: { id: id }
        })

        if (updated)
            res.status(200).json({ message: 'Agendamento atualizado com sucesso' })
        else
            res.status(404).json({ message: 'Agendamento não encontrado' })
    } catch (error) {
        console.log('um erro ocorreu, ', error)
        res.status(500).json({ message: 'Erro ao atualizar agendamento' })
    }
})



routes.delete('/agendamento/delete/:id', async (req, res) => {
    try {
        const { id } = req.params

        const deleted = await agendamento.destroy({
            where: { id: id }
        })

        if (deleted)
            res.status(200).json({ message: 'Agendamento removido com sucesso' })
        else
            res.status(404).json({ message: 'Agendamento não encontrado' })
    } catch (error) {
        console.log('um erro ocorreu, ', error)
        res.status(500).json({ message: 'Erro ao remover agendamento' });
    }
})



module.exports = routes
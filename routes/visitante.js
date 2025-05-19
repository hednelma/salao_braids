const express = require('express')
const routes = express.Router()
const Cliente = require('./../models/Cliente')
const Email = require('./../email/enviadordeemail')
const jwt = require('../configs/auth')
const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const generateUserName = require('../funçao/generateUserName')


routes.post('/login', async (req, res) => {
    try {
        const { nomeutilizador, senha } = req.body

        const user = await Cliente.findOne({
            where: {
                nomeutilizador: {
                    [Op.eq]: nomeutilizador.trim()
                }
            }
        })

        if (user) {

            if (bcrypt.compareSync(senha, user.senha)) {
                const meuToken = jwt.gerarToken({ user })
                res.status(200).json({ user: user, token: meuToken })
            }

            else
                res.status(401).json({ message: "username ou senha invalidos" })
        }
        else
            res.status(404).json({ message: 'username ou senha invalidos' })

    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: "Erro ao realizar login",
            error: error.message
        })
    }
})

routes.post('/register', async (req, res) => {
    try {
        const { nome, senha, email } = req.body
        const nomeutilizador = await generateUserName(nome)
        const salt = bcrypt.genSaltSync(10)
        const passwordHash = bcrypt.hashSync(senha, salt)
        const user = await Cliente.create({ nome, nomeutilizador, email, senha: passwordHash })
        if (user){
            Email.enviarEmail({email, nome, nomeutilizador})
            res.status(200).json(user)
        }
        else
            res.status(400).json({ message: "Erro ao criar usuario" })

    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Erro ao registar", error: error.message })
    }
})


module.exports = routes
const jwt = require('../configs/auth')

const middleware = (tipo) => async (req, res, next) => {
    const [bearer, token] = req.headers.authorization.split(" ")
    if (!token)
        return res.status(401).json({ mensagem: 'Acesso negado. Token inválido!!!' })
    try {
        try {
            const user = (jwt.verificarToken(token)).user
            req.user = user
            if (tipo.includes(req.user.tipo))
                next()
            else
                return res.status(401).json({ mensagem: 'Acesso negado. Esse perfil não pode acessar aqui!!!' })
        } catch (error) {
            return res.status(401).json({ mensagem: 'Token inválido!!!', error: error.messege })
        }

    } catch (error) {
        res.status(401).json({ mensagem: 'Token inválido!!!', error: error.messege })
        next(error)
    }
}

module.exports = middleware
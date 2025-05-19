const jwt = require('jsonwebtoken')

module.exports = {
// esta funcao gera token
    gerarToken: (dados) => {
        const token = jwt.sign(dados, process.env.JWT_SECRET)
        return token



    },
// esta verfica se é valido ou não
    verificarToken: (token) => {
        return jwt.verify(token, process.env.JWT_SECRET)
    }
}
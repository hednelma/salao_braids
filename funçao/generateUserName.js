const Cliente = require("./../models/Cliente")

const generateUserName = async (name) => {
    let username = name.toLowerCase().replace(/\s+/g, '')
    try {
        
        const users = await Cliente.findAll({
            attributes: ["nomeutilizador"]
        })

        const usernames = users.map(user => user.nomeutilizador)
        let attempt = 1
        let newUsername = username

        while (usernames.includes(newUsername)) {
            newUsername = `${username}${Math.floor(Math.random() * 1000)}`
            attempt++
            if (attempt > 1000) break
        }

        return newUsername

    } catch (error) {
        console.error("Erro ao gerar username:", error)
        return null
    }
}

module.exports = generateUserName

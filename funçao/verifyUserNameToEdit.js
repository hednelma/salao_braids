const User = require("../models/Cliente")

const verifyUserNameToEdit = async (name) => {
    let username = name.toLowerCase().replace(/\s+/g, '')
    try {

        const users = await User.findAll({
            attributes: ["nomeutilizador"]
        })

        const usernames = users.map(user => user.nomeutilizador.trim())
        console.log(usernames)
        let count = 0

        for (let a = 0; count == 0 && a < usernames.length; a++) {

            if(usernames[a].trim() === username.trim())
                count++
        }


        return count === 0

    } catch (error) {
        console.error("Erro:", error)
        return false
    }
}

module.exports = verifyUserNameToEdit

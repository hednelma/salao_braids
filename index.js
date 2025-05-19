const express = require('express')
const cors = require('cors')
const visitante = require('./routes/visitante')
const cliente = require('./routes/cliente')
const administrador = require('./routes/administrador')
const app = express()
const port = 4041


app.use(express.json())
app.use(cors())
app.use('/visitante', visitante)


//Rotas
app.use('/visitante', visitante)
app.use('/cliente', cliente)
app.use('/administrador', administrador)

app.get('/', (req, res) => {
    res.send("Essta funcionando...")
})

app.listen(port, () => {
    console.log('Server is ronning on port', port)
})

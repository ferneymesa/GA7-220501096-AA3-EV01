const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')

// Configuramos Variables de Entorno
dotenv.config()
const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Definimos la Ruta
const taskRoutes = require('./models/routes/tasks')
app.use('/api/tasks', taskRoutes)

// Conectar a MongoDB y iniciar servidor
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Conectado a MongoDB')
        const PORT = process.env.PORT || 5000
        app.listen(PORT, () => console.log(`Server run on port ${PORT}`))
    })
    .catch(err => console.error('Error conectando a MongoDB:', err))


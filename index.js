'use strict'

const express = require('express')
const mongoose = require('mongoose')
const config = require('./config')
const hbs = require('express-handlebars')
const router = require('./routes/routes')

const app = express()

// method-override
const methodOverride = require('method-override')
app.use(methodOverride('_method'))

//Body Parser
app.use(express.urlencoded({extended:true}))
app.use(express.json())
//Motor de Vistas
app.engine('.hbs', hbs({
    defaultLayout: 'index',
    extname: '.hbs'
}))
app.set('view engine', '.hbs')
//Recursos Estáticos
app.use('/static', express.static('public'))

//Router app
app.use('/', router)

mongoose.connect(config.db, config.urlParser, (err, res) =>{
    if(err){
        return console.log(`Error al conectar en la BD ${err}`)
    }
    console.log('Conexión a la BD exitosa')
    app.listen(config.port, ()=>{
        console.log(`Ejecutando en http://localhost:${config.port}`)
    })
})
// CERON URIBE ARTURO
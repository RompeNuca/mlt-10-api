'use strict'

const mysql = require('mysql');
const app = require('./app');
const config = require('./config');

const connection = mysql.createConnection(config.db)

  connection.connect( (err, res) => {
    if (err) { return console.log(`Error al conectar a la base de datos ${err}`) }
    console.log('conexion a la base de datos establecida...')
    app.listen(config.port, () => { console.log((`el servidor esta andando en ${config.domain}${config.port}`)) }) 
  })

module.exports = connection

'use strict'

const User = require('../models/user');

function signUp (req, res) {
  var user = new User()

  user.name = req.body.name
  if (req.body.age) {
    //Obligo al campo a ser un numero porque postman me envia
    //todos strngs
    user.age = parseInt( req.body.age,10 )
    user.age = 'Estoy mal'
  }
  user.check()
  user.save('first_table' , err => {
    if (err) return res.status(500).send({ msg: `Error al crear usuario: ${err}` })
    return res.status(200).send({ user: user })
  })
}

function getUsers (req, res) {
 
  User.gett('first_table', (err, users) => {
    if (err) return res.status(500).send({ msg: `Error al obtener todos los Usuarios` })
    return res.status(200).send({ users: users })
  })
}


module.exports = {
  signUp,
  getUsers
}

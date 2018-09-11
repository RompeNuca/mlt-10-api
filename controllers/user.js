'use strict'

const User = require('../models/user');

function getUsersSimple (req, res) {
  User.gett('first_table', (err, users) => {
    if (err) return res.status(500).send({ msg: `Error al obtener todos los Usuarios` })
    return res.status(200).send({ users: users })
  })
}

function getUsers (req, res) {
  //EJEMPLO
  //http://localhost:3000/api/user/id/9,2,5/id,name,age

  //Ordenar de menor a mayor
  var values = req.params.values.split(',')
  var order = values.sort(function (a, b) {
    return a - b;
  })
  
  var select = {
    key: req.params.key,
    keys:req.params.keys,
    values: req.params.values,
    order: order,
  }
  
  User.get('first_table', select, (err, results) => {
  //EJEMPLO
  //http://localhost:3000/api/users
    console.log(err);
    console.log(results);
    if (err) return res.status(500).send({ msg: `Error al traer los Usuarios` })
    return res.status(200).send({ users: results })
  })

}

function signUp (req, res) {
  var user = new User()
  user.name = req.body.name
  if (req.body.age) {
    //Obligo al campo a ser un numero porque postman me envia
    //todos strngs
    user.age = parseInt( req.body.age,10 )
  }
  // user.check()
  user.save('first_table' , err => {
    if (err) return res.status(500).send({ msg: `Error al crear usuario: ${err}` })
    return res.status(200).send({ user: user })
  })
}

function putUser (req, res) {
  let id = req.params.id
  var user = new User()
  user.name = req.body.name
  if (req.body.age) {
    user.age = parseInt( req.body.age,10 )
  }
  // user.age = req.body.age
  // user.colorPelo = req.body.colorPelo
  user.check()
  user.update('first_table', id, err => {
    if (err) return res.status(500).send({ msg: `Error al editar usuario: ${err}` })
    return res.status(200).send({ user: user })
  })
}

function deleteUser (req, res) {
  let id = req.params.id
 
  // user.check()
  User.delete('first_table', id, err => {
    if (err) return res.status(500).send({ msg: `Error al eliminar usuario: ${err}` })
    return res.status(200).send({ user: `Usuarion ${id} eliminado` })
  })
}


module.exports = {
  signUp,
  getUsersSimple,
  getUsers,
  putUser,
  deleteUser
}

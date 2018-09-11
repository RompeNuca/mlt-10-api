'use strict'

const express = require('express');
const userCtrl = require('../controllers/user');

const api = express.Router()

// Envios al servidor de Nuevo usuario
api.post('/user', userCtrl.signUp)

// Peticiones al servidor de usuarios
api.get('/users', userCtrl.getUsersSimple)

// Peticiones al servidor de usuarios compleja
api.get('/user/:key/:values/:keys', userCtrl.getUsers)

// Actualizar usuarios
api.put('/user/:id', userCtrl.putUser)

// Elimina usuarios
api.delete('/user/:id', userCtrl.deleteUser)


// Peticiones al servidor de usuario
// api.get('/user/:userId', userCtrl.getUser)


module.exports = api

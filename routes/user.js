'use strict'

const express = require('express');
const userCtrl = require('../controllers/user');

const api = express.Router()

// Envios al servidor de Nuevo usuario
api.post('/user', userCtrl.signUp)

// Peticiones al servidor de usuarios
api.get('/user', userCtrl.getUsers)

// Peticiones al servidor de usuario
// api.get('/user/:userId', userCtrl.getUser)


module.exports = api

'use strict'

const admin = require('../admin');
const Schema = admin.Schema;

const UserSchema = Schema({
  name: 'string',
  age: 0,
  // Refactorizar los tipos para poder crear el POPULATE
  // libros: [{ type: admin.Schema.Types.ObjectId, ref: 'Libros'}],
}, {
  collection: 'Users'
})

module.exports = admin.model('User', UserSchema)
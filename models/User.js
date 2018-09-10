'use strict'

const admin = require('../admin');
const Schema = admin.Schema;

const UserSchema = Schema({
  name: 'string',
  age: 0
}, {
  collection: 'Users'
})

module.exports = admin.model('User', UserSchema)
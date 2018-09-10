'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Req routes
  const userRoutes = require('./routes/user')
//---

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.use('/public', express.static('public'));

// Use routes
  app.use('/api', userRoutes);
//---

module.exports = app

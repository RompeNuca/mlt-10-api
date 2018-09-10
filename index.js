'use strict'

const app = require('./app');
const config = require('./config');

app.listen(config.port, () => { console.log((`el servidor esta andando en ${config.domain}${config.port}`)) }) 

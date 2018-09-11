'use strict'

const mysql = require('mysql');
const config = require('../config');
const connection = mysql.createConnection(config.db)

  connection.connect( (err, res) => {
    if (err) { return console.log(`Error al conectar a la base de datos ${err}`) }
  })

//Admin el PADRE DE TODO metodos(GPED), configuracines, regex y esquemas.
const admin = {};
//Todo lo que se extiende de Admin
admin.config = Object;
admin.Schema = Object;

  //NOTA: __proto__ es el prototipo del Constructor ?
  //NOTA: prototype es el prototipo de las instancias ?
  //Averiguar bien las diferencias
admin.Schema.types = {}
admin.Schema.prototype.check = check;
admin.Schema.prototype.autoCheck = autoCheck;
admin.Schema.prototype.save = post;
admin.Schema.prototype.update = update;
admin.Schema.__proto__.delete = del;
admin.Schema.__proto__.get = get;
admin.Schema.__proto__.gett = gett;
Object.seal(admin.Schema.prototype)


admin.model = (name, schema) => {

  var keys = Object.keys(schema)
  var types = Object.values(schema)

  function Constructor(){}
  
  //Recorro el Schma y voy creando las propiedas del constructor
  Constructor.prototype.schema = {}
  for (let i = 0; i < keys.length; i++) {
    let property = keys[i]; let type = types[i];
    Constructor.prototype.schema[property] = type
  }

  return Object.defineProperty(Constructor, "name", { value: `${name}` });

}

//Funciones que son igualas a metods

//CONSULTAS Y ACCIONES A LA BD
function gett(table, cb) {
  var sql = `SELECT * FROM \`${table}\``
  connection.query(sql, (error, results, fields) => {
    if (error) { return cb(error) }
    return cb(null, results)
  })
}

function get(table, select, cb) {
  //En este caso select es un objeto,
  //Este contendra el Id, el orden y cuquier otra configuracion futura.
  var key = select.key
  var keys = select.keys.toString()
  var values = select.values.toString()
  var order = select.order.toString()

  var sql = `SELECT ${keys} FROM \`${table}\` WHERE \`${key}\` IN (${values}) ORDER BY FIELD(\`${key}\`,  ${order})`
  console.log(sql);
  
  connection.query(sql, (error, results, fields) => {
    if (error) { return cb(error) }
    return cb(null, results)
  })
}

function post( table, cb ) {

  //AGREGAR: verificacion si existe la tabla
  //si no existe la crea a partir del Schema en la bd.
  
  let checkErr = this.autoCheck(err => {
    if (err) { return err }
  })

  if (checkErr) { return cb(checkErr) }

  var sql = constPath('post', table, this)

    connection.query(sql, (err, results, fields) => {
      if (err) { console.log(err); return cb(err) }
      console.log(results)      
      return cb()
    })
}

function update( table, id, cb ) {
  //this es el nuevo Objeto

  let checkErr = this.autoCheck(err => {
    if (err) { return err }
  })

  if (checkErr) { return cb(checkErr) }

    var sql = constPath('update', table, this, id)
    
    connection.query(sql, (err, results, fields) => {
      if (err) { console.log(err); return cb(err) }
      console.log(results)      
      return cb()
    })
}

function del( table, id, cb ) {
  //se puede hacer comprovacion de existencia.

    var sql = constPath('delete', table, this, id)
    console.log(sql);
    
    connection.query(sql, (err, results, fields) => {
      if (err) { console.log(err); return cb(err) }
      console.log(results)      
      return cb()
    })
}

//CONSTRUCTOR DE PATHS PARA LAS CONSULTAS
function constPath(type, table, objet, id) {

  var keys = Object.keys(objet)
  var values = Object.values(objet)

  switch (type) {
    case 'post':
      //POST
      var cont = 0
      var sqlKeys = '('
        for (let i = 0; i < keys.length; i++) {
          sqlKeys += `\`${keys[i]}\``      
          cont += 1
          if ( keys.length > 1 && keys.length > cont) {
            sqlKeys += ', '
          }
        }
      cont = 0
      sqlKeys += ')'
      var sqlValues = 'VALUES ('
        for (let i = 0; i < values.length; i++) {
          sqlValues += `\'${values[i]}\'` 
          cont += 1       
          if (values.length > 1 && values.length > cont) {
            sqlValues += ', '
          }
        }
      cont = 0
      sqlValues += ')'
    
      return `INSERT INTO \`${table}\` ${sqlKeys} ${sqlValues}`
    break;

    case 'update':
    //PUT
    var cont = 0
    var sqlKeys = ''
      for (let i = 0; i < keys.length; i++) {
        sqlKeys += `\`${keys[i]}\`= "${values[i]}"`      
        cont += 1
        if ( keys.length > 1 && keys.length > cont) {
          sqlKeys += ', '
        }
      }
    cont = 0
    return `UPDATE \`${table}\` SET ${sqlKeys} WHERE \`id\`="${id}"`
    break;

    case 'delete':
    //DELETE
    return `DELETE FROM \`${table}\` WHERE \`id\`="${id}"`
    break;
  }


}

//SITEMA DE COMPROVACION DE ESQUEMAS
function autoCheck(cb) {

  var validObjet = compareKeys(this, this.__proto__.schema)
  if (!validObjet) {
    return cb(`El Objeto no coincide con su modelo`)
  }

  var validTypes = compareTypes(this, this.__proto__.schema)
  if (!validTypes) {
    return cb(`Los tipos de datos no cumplen con el modelo`)
  }
}

function compareKeys(a, b) {
  var candidate = Object.keys(a).sort();
  var model = Object.keys(b).sort();

  candidate.__proto__.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
  };
  var errors = candidate.diff(model)

  if (errors.length !== 0) {
    console.log('\x1b[0m');
    console.log('\x1b[31m',`Estas keys: (${errors}) no coincide con su modelo`);
    console.log('\x1b[0m');
    return false
  }
  return true
}

function compareTypes(a, b) {
  //Refactorizar para que extender los tipos y tener Objet ID
  let typesEl = Object.values(a)
  let types = Object.values(b)
  let keys = Object.keys(b)

  var errors = []

  for (let i = 0; i < typesEl.length; i++) {
    let type = typeof typesEl[i]; 
    let typeModel = typeof types[i]; 
    let property = keys[i]; 
    if (type !== typeModel) {
      errors.push(property)
    }
  }
  if (errors.length !== 0) {
    console.log('\x1b[0m');
    console.log('\x1b[31m',`Estos tipo/s de dato/s no conrresponden al modelo: ${errors}`);
    console.log('\x1b[0m');
    return false
  }
  return true
}

//AYUDAS PARA DEVELOPERS
function check() {

  console.log('\x1b[0m');
  console.log('\x1b[33m',`Chequeando: ${this.name}`)
  
  let typesEl = Object.values(this)
  let types = Object.values(this.__proto__.schema)
  let keys = Object.keys(this.__proto__.schema)

  for (let i = 0; i < typesEl.length; i++) {
    
    let type = typeof typesEl[i]; 
    let typeModel = typeof types[i]; 
    let property = keys[i];
        
    if (type == typeModel) {
      console.log('\x1b[32m',` -${property}: type OK :)`)
    }else{
      console.log('\x1b[31m',` -${property}: type ERR :(`)
    }
  }
  console.log('\x1b[0m');
}

module.exports = admin

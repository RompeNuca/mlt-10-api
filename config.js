module.exports = {
  domain: 'http://localhost:',
  port: process.env.PORT || 3000,
  db:{
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  }
}
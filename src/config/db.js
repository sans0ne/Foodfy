const { Pool } = require('pg')

module.exports = new Pool({
    user:'postgres',
    password:'160204',
    host:'localhost',
    port:5432,
    database:'foodfy'
})
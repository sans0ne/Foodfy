const { Pool } = require('pg')

module.exports = new Pool({
    user:process.env.DBUSER,
    password:process.env.DBPWD,
    host:'localhost',
    port:5432,
    database:'foodfy'
})
const express = require('express')
const nunjuncks = require('nunjucks')
const routes = require('./routes')
const override = require('method-override')

const server = express()

server.use(express.urlencoded({extended:true}))
server.use(express.static('public'))
server.use(override('_method'))
server.use(routes)

server.set('view engine','njk')

nunjuncks.configure('src/app/views',{
    express: server,
    autoescape:false,
    noCache:true
})

server.listen(process.env.PORT,function(){ 
    console.log(`server is running on port ${process.env.PORT}`)
})

//teste novo branch
const express = require('express')
const recipes = require('./app/controllers/recipes')
const chefs = require('./app/controllers/chefs')
const multer = require('./app/middlewares/multer')
const SessionController = require('./app/controllers/SessionController')
const {isLogged,onlyUsers} = require('./app/middlewares/session')
const SessionValidator = require('./app/validators/session')
const UserController = require('./app/controllers/users')
const routes = express.Router()

routes.get('/',recipes.home)
routes.get('/sobre',recipes.sobre)
routes.get('/receitas',recipes.receitas)
routes.get('/receitas-detalhes/:id',recipes.detalhes)
routes.get('/chefs',recipes.chefs)


routes.get('/admin/login',isLogged, SessionController.index)
routes.post('/admin/login',SessionValidator.login,SessionController.login)//esse post é somente para logar e nao criar o usuario
routes.post('/admin/logout',SessionController.logout)//esse post é somente para deslogar

//avaliar para deixar igual ao exemplo do exercicio com ProfileController
routes.get('/admin/users',onlyUsers,UserController.index)
routes.put('/admin/users',onlyUsers,UserController.put)

//vai ter que ajustar essa rota, criar um get para acessar a pagina de create e usar esse post
routes.post('/admin/users',UserController.post) //criar usuario

routes.get('/admin/recipes',recipes.index)
routes.get('/admin/recipes/create',recipes.create)
routes.get('/admin/recipes/:id',recipes.show)
routes.get('/admin/recipes/:id/edit',recipes.edit)
routes.post('/admin/recipes',multer.array('image',5),recipes.post)
routes.put('/admin/recipes/:id/edit',multer.array('image',5),recipes.put)
routes.delete('/admin/recipes/:id/edit',recipes.delete)


routes.get('/admin/chefs',chefs.index)
routes.get('/admin/chefs/create',chefs.create)
routes.get('/admin/chefs/:id',chefs.show)
routes.get('/admin/chefs/:id/edit',chefs.edit)
routes.post('/admin/chefs',multer.single('image'),chefs.post)
routes.put('/admin/chefs',multer.single('image'),chefs.update)
routes.delete('/admin/chefs',chefs.delete)

module.exports = routes
const express = require('express')
const recipes = require('./app/controllers/recipes')
const chefs = require('./app/controllers/chefs')
const multer = require('./app/middlewares/multer')

const routes = express.Router()

routes.get('/',recipes.home)
routes.get('/sobre',recipes.sobre)
routes.get('/receitas',recipes.receitas)
routes.get('/receitas-detalhes/:id',recipes.detalhes)
routes.get('/chefs',recipes.chefs)


routes.get('/admin',(req,res) =>{
    res.redirect('/admin/recipes')
})
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
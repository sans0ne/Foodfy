const fs = require('fs')
const filesModel = require('../models/filesModel')
const chefsModel = require('../models/chefsModel')
const recipeModel = require('../models/recipeModel')

module.exports = {
    async index(req,res){
        const results = await chefsModel.all()
        const chefs = results.rows.map(chef =>({
            ...chef,
            src:`${req.protocol}://${req.headers.host}${chef.path.replace('public','')}`
        }))


        return res.render('admin/chefs/index',{chefs})
    },
    async show(req,res){
        const {id} = req.params

        let results = await chefsModel.findChefs(id)
        const chef = results.rows[0]

        chef.src = `${req.protocol}://${req.headers.host}${chef.path.replace('public','')}`

        results = await chefsModel.countRecipes(id) //ver coluna recipe.image que tirei desta consulta
        const recipes = results.rows

        const recipesPromise = recipes.map( async recipe =>{
            const file = await recipeModel.findFile(recipe.id)
            recipe.src = `${req.protocol}://${req.headers.host}${file.rows[0].path.replace('public','')}`
        })

        await Promise.all(recipesPromise)

        return res.render('admin/chefs/show',{recipes,chef})
    },
    create(req,res){
        return res.render('admin/chefs/create')
    },
    async edit(req,res){
        const {id} = req.params

        let results = await chefsModel.findChefs(id)
        const chef = results.rows[0]

        chef.src = `${chef.path}`

        return res.render('admin/chefs/edit',{chef})
    },
    async post(req,res){
        const keys = Object.keys(req.body)
        let objetos = []

        for(let key of keys){
            if(req.body[key] == ''){
                objetos.push(key)
            }
        }
        if(objetos.length != 0){
            return res.send(`Preencha os campos ${objetos}`)
        }

        if(!req.file){
            return res.send('Envie uma imagem para o avatar')
        }
            
        const file = req.file
        let results = await filesModel.create({...file})
        const fileId = results.rows[0].id
        
        await chefsModel.create(req.body,fileId)

        return res.redirect(`/admin/chefs`)
    },
    async update(req,res){
        
        let results = await chefsModel.findAvatar(req.body.id)
        let fileId = results.rows[0].file_id

        if(req.file){
            
            const file = req.file
            results = await filesModel.create({...file})
            const newfileId = results.rows[0].id
            await chefsModel.update(req.body,newfileId)
            
            try{
                await filesModel.deletefromFiles(fileId)
            }catch(err){
                console.log(`erro ao deletar ${err}`)
            }

        }else{
            await chefsModel.update(req.body,fileId)
        }
        

        return res.redirect(`/admin/chefs/${req.body.id}`)
        
    },
    async delete(req,res){
        const {id} = req.body

        const results = await chefsModel.findAvatar(id)

        fs.unlink(results.rows[0].path,(err)=>{
            if(err) console.log(`erro ao deletar chef ${err}`)
        })

        await chefsModel.delete(id)

        return res.redirect('/admin/chefs')
    }
}
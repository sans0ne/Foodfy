const chefsModel = require('../models/chefsModel')

module.exports = {
    index(req,res){
        chefsModel.all(function(chefs){
            return res.render('admin/chefs/index',{chefs})
        })
    },
    show(req,res){
        const { id } = req.params

        chefsModel.findChefs(id,function(chef){

            chefsModel.countRecipes(id,function(recipes){
                return res.render('admin/chefs/show',{recipes,chef})
            })
        })    
    },
    create(req,res){
        return res.render('admin/chefs/create')
    },
    edit(req,res){
        const {id} = req.params

        chefsModel.findChefs(id,function(chef){
            if(!chef) return res.send('Chef not found')    

            return res.render('admin/chefs/edit',{chef})
        })
    },
    post(req,res){
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
        chefsModel.create(req.body,function(){
            res.redirect(`/admin/chefs`)
        })
    },
    update(req,res){
        chefsModel.update(req.body,function(){
            return res.redirect(`/admin/chefs/${req.body.id}`)
        })
        
    },
    delete(req,res){
        const {id} = req.body

        chefsModel.delete(id,function(chef){
            return res.redirect('/admin/chefs')
        })
    }
}
const recipeModel = require('../models/recipeModel')

exports.home = (req,res)=>{

    recipeModel.all(function(recipes){
        res.render('home',{recipes})

    })
}
exports.sobre = (req,res)=>{
    res.render('sobre')
}
exports.receitas = (req,res)=>{
    let {filter,page,limit} = req.query

    page = page || 1
    limit = limit || 3
    let offset = limit * (page-1)

    const params = {
        filter,
        page,
        limit,
        offset,
        callback(recipes){
            
            let total=0
            if(recipes.length > 0) total = Math.ceil(recipes[0].total / limit)

            const pagination = {
                total,
                page
            }
            return res.render('receitas',{recipes,pagination,filter})
        }
    }
    recipeModel.paginate(params)
}
exports.detalhes = (req,res)=>{
    const { id } = req.params

    recipeModel.find(id,function(recipe){

        res.render('detalhes',{recipe})
    })

}
exports.chefs = (req,res) => {
    recipeModel.chefsAndRecipes(function(chefs){
        return res.render('chefs',{chefs})
    })
}



exports.index = (req,res) => {

    recipeModel.all(function(recipes){
        res.render('admin/recipes/index',{recipes})

    })
}
exports.show = (req,res) =>{
    const { id } = req.params
    
    recipeModel.find(id,function(recipe){
        res.render('admin/recipes/show',{recipe})

    })
    
}
exports.edit = (req,res) =>{
    const { id } = req.params
    
    recipeModel.find(id,function(recipe){
        
        recipeModel.chefsOptions(function(chefs){
            return res.render('admin/recipes/edit',{chefs,recipe})
        })

    })
}
exports.create = (req,res) =>{

    const recipe = {
        ingredients:[],
        preparation:[]
    }
    recipeModel.chefsOptions(function(chefs){
        return res.render('admin/recipes/create',{chefs,recipe})
    })
}
exports.post = (req,res) =>{
    const keys = Object.keys(req.body)

    let obj = []

    for(let key of keys){

        if(req.body[key] == ''){
            obj.push(key)
        }
    }
    if(obj.length!=0){
        return res.send(`Preencha os campos ${obj}`)
    }

    recipeModel.create(req.body,function(){
        return res.redirect(`/admin`)

    })
   
    
}
exports.put = (req,res) =>{
    
    recipeModel.update(req.body,function(recipe){
        return res.redirect(`/admin/recipes/${req.body.id}`)

    })

}
exports.delete = (req,res) =>{
    const { id } = req.params

    recipeModel.delete(id,function(){
        return res.redirect('/admin')

    })

} 
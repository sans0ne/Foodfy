const db = require('../../config/db')
const fs = require('fs')
const recipeModel = require('../models/recipeModel')
const filesModel = require('../models/filesModel')
const recipe_filesModel = require('../models/recipe_filesModel')
const chefsModel = require('../models/chefsModel')

exports.home = async (req,res)=>{

    const results = await recipeModel.all()
    const recipes = results.rows

    const recipesPromise = recipes.map(async recipe =>{
        const file = await recipeModel.findFile(recipe.id)
        recipe.src = `${req.protocol}://${req.headers.host}${file.rows[0].path.replace('public','')}`
    })

    await Promise.all(recipesPromise)

    return res.render('home',{recipes})
}
exports.sobre = (req,res)=>{
    res.render('sobre')
}
exports.receitas = async (req,res)=>{
    let {filter,page,limit} = req.query

    page = page || 1
    limit = limit || 3
    let offset = limit * (page-1)

    const params = {
        filter,
        page,
        limit,
        offset,
        async callback(recipes){
            
            let total=0
            if(recipes.length > 0) total = Math.ceil(recipes[0].total / limit)

            const pagination = {
                total,
                page
            }
            
            const recipesPromise = recipes.map(async recipe =>{
                const file = await recipeModel.findFile(recipe.id)
                recipe.src = `${req.protocol}://${req.headers.host}${file.rows[0].path.replace('public','')}`
            })
            await Promise.all(recipesPromise)

            return res.render('receitas',{recipes,pagination,filter})
        }
    }
    recipeModel.paginate(params)
}
exports.detalhes = async (req,res)=>{
    const { id } = req.params

    let results = await recipeModel.find(id)
    const recipe = results.rows[0]

    results = await recipeModel.findFiles(id)
    const files = results.rows.map(file =>({
        ...file,
        src:`${req.protocol}://${req.headers.host}${file.path.replace('public','')}`
    }))

    return res.render('detalhes',{recipe,files})

}
exports.chefs = async (req,res) => {
    const results = await recipeModel.chefsAndRecipes()
    const chefs = results.rows

    const chefPromises = chefs.map(async chef =>{
        const file = await chefsModel.findAvatar(chef.id)
        chef.src = `${req.protocol}://${req.headers.host}${file.rows[0].path.replace('public','')}`
    })

    await Promise.all(chefPromises)
    
    return res.render('chefs',{chefs})
}



exports.index = async (req,res) => {

    const results = await recipeModel.all()
    const recipes = results.rows

    const recipesPromise = recipes.map(async recipe =>{
        const file = await recipeModel.findFile(recipe.id)
        recipe.src = `${req.protocol}://${req.headers.host}${file.rows[0].path.replace('public','')}`
    })
    await Promise.all(recipesPromise)       
    
    return res.render('admin/recipes/index',{recipes})
}
exports.show = async (req,res) =>{
    const { id } = req.params
    
    let results = await recipeModel.find(id)
    const recipe = results.rows[0]

    results = await recipeModel.findFiles(id)
    const files = results.rows.map(file =>({
        ...file,
        src:`${req.protocol}://${req.headers.host}${file.path.replace('public','')}`
    }))
    
    return res.render('admin/recipes/show',{recipe,files})
    
}
exports.edit = async (req,res) =>{
    const { id } = req.params
    
    let results = await recipeModel.find(id)
    const recipe = results.rows[0]

    results = await recipeModel.chefsOptions()
    const chefs = results.rows

    results  = await recipeModel.findFiles(id)
    const files = results.rows.map(file => ({
        ...file,
        src:`${req.protocol}://${req.headers.host}${file.path.replace('public','')}`
    }))
    
    return res.render('admin/recipes/edit',{chefs,recipe,files})
}
exports.create = async (req,res) =>{

    const recipe = {
        ingredients:[],
        preparation:[]
    }
    const results = await recipeModel.chefsOptions()
    const chefs = results.rows

    return res.render('admin/recipes/create',{chefs,recipe})
}
exports.post = async (req,res) =>{
    const keys = Object.keys(req.body)

    let obj = []

    for(let key of keys){

        if(req.body[key] == '' && key != 'removed_files'){
            obj.push(key)
        }
    }
    if(obj.length!=0){
        return res.send(`Preencha os campos ${obj}`)
    }

    if(req.files.length == 0){
        return res.send('Envie pelo menos uma imagem')
    }

    let results = await recipeModel.create(req.body)
    const recipeId = results.rows[0].id

    const filesPromise = req.files.map(async file => {
        filesModel.create({...file})
        const results = await filesModel.find(file.filename)
        const fileId = results.rows[0].id
        recipe_filesModel.create(recipeId,fileId)
    })
    await Promise.all(filesPromise)

    return res.redirect(`/admin`)
}
exports.put = async (req,res) =>{

    const keys = Object.keys(req.body)
    let objetos = []

    for (let key of keys) {
        if (req.body[key] == '' && key != 'removed_files')
            objetos.push(key)
    }

    if (objetos.length != 0) {
        return res.send(`Preencha os campos ${obj}`)
    }

    if (req.files.length != 0) {
        const newsFilesPromise = req.files.map(async file => {
            filesModel.create({ ...file })
            const results = await filesModel.find(file.filename)
            const fileId = results.rows[0].id
            recipe_filesModel.create(req.body.id, fileId)
        })
        await Promise.all(newsFilesPromise)
    }

    if(req.body.removed_files){
        const removedFiles = req.body.removed_files.split(',')
        const lastIndex = removedFiles.length -1
        removedFiles.splice(lastIndex,1)

        //ta pegando id de recipe_file, tem que pegar de files
        //ou mudar o metodo delete do filesModel
        const removedFilesPromise = removedFiles.map(id => filesModel.delete(id))

        await Promise.all(removedFilesPromise)
    }

    await recipeModel.update(req.body)

    return res.redirect(`/admin/recipes/${req.body.id}`)

}
exports.delete = async (req,res) =>{
    const { id } = req.params

    try{
        
        const result = await db.query(`SELECT files.path FROM files
                                       LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
                                       WHERE recipe_files.recipe_id = $1`,[id])

        const files = result.rows

        files.map(file => {
            fs.unlinkSync(file.path)
        })
        
        await recipeModel.delete(id)
        
        return res.redirect('/admin')

    }catch(err){
        console.log(err)
    }
    

} 
const usersModel = require('../models/users')
const mailer = require('../../libs/mailer')

module.exports = {
  async index(req,res){
    const {userId: id} = req.session

    const user = await usersModel.findById(id)

    if(!user){
      return res.render('admin/users/index',{
        error:`Usuário não encontrado`,
        user:req.body
      })
    }

    return res.render('admin/users/index',{user})
  },
  async post(req,res){
    try {
      const keys = Object.keys(req.body)

      let obj = []

      for(let key of keys){

          if(req.body[key] === '' && key !== 'administrador'){
              obj.push(key)
          }
      }
      if(obj.length!==0){
          return res.render('admin/users/create',{
            error:`Preencha os campos ${obj}`,
            user:req.body
          })
      }

      const alreadyExists = await usersModel.findOne(req.body.useremail)

      if(alreadyExists){
        return res.render('admin/users/create',{
          error:`Usuário já cadastrado com o email ${req.body.useremail}`,
          user: req.body
        })
      }

      await usersModel.create(req.body)
      const newUser = await usersModel.findOne(req.body.useremail)
   
      await mailer.sendMail({
        to:newUser.email,
        from:'no-reply@foodfy.com.br',
        subject:'Novo cadastro de usuário',
        html:`<h2>Novo cadastro de usuário</h2>
        <p>Seu cadastro na plataforma Foodfy foi feito com sucesso</p>
        <p>Sua senha para acesso ao sistema é ${newUser.password}</p>
        <a href='http://localhost:3000/admin' target='_blank'>
          Clique aqui para acessar com seu email e a senha informada
        </a>
        `
      })

      return res.redirect('/admin/recipes')
    } catch (error) {
      return res.render('admin/users/create',{
        error:`Ocorreu o erro ${error}.Tente novamente`
      })
    }
  },
  async put(req, res) {
    try {
      const keys = Object.keys(req.body)

      let obj = []

      for (let key of keys) {

        if (req.body[key] === '' && key !== 'id') {
          obj.push(key)
        }
      }
      if (obj.length !== 0) {
        return res.render('admin/users/index', {
          error: `Preencha os campos ${obj}`,
          user: {
            name: req.body.username,
            email: req.body.useremail,
            id: req.body.id
          }
        })
      }

      const {id} = req.body

      await usersModel.update(id,req.body)

      return res.render('admin/users/index',{
        user: {
          name: req.body.username,
          email: req.body.useremail,
          id: req.body.id
        },
        success:'Conta atualizada com sucesso'
      })  

    } catch (error) {
      return res.render('admin/users/index',{
        error:`Ocorreu o erro ${error}.Tente novamente`
      })
    }
  }
}
const User = require('../models/users')

async function login(req,res,next){
  const {email,password} = req.body

  const user = await User.findOne(email)

  if(!email) return res.render('admin/session/login',{
    error:'Preencha o campo email',
    user:req.body  
  })

  if(!user) return res.render('admin/session/login',{
    error:'Usuário não cadastrado',
    user:req.body  
  })

  const passed = password === user.password

  if(!passed) return res.render('admin/session/login',{
    error:'Senha incorreta',
    user:req.body
  })

  req.user = user

  next()
}

module.exports = {
  login
}
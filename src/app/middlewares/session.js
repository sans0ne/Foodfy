function isLogged(req,res,next){

  if(req.session.userId){
    return res.send('enviar para tela de usuario logado')
  }

  next()
}

function onlyUsers(req,res,next){
  if(!req.session.userId){
    return res.redirect('/admin/login')
  }

  next()
}

module.exports = {
  isLogged,
  onlyUsers
}
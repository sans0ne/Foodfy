module.exports = {
  async index(req,res) {
    return res.render('admin/session/login')
  },
  async login(req,res){
    req.session.userId = req.user.id //aqui registra a sessao

    return res.redirect('/admin/users')
  },
  logout(req,res){
    req.session.destroy()
    return res.redirect('/admin/login')
  }
}
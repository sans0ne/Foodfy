const db = require('../../config/db')
const {date} = require('../../libs/utils')
const crypto = require('crypto')
const { update } = require('../controllers/chefs')

module.exports = {
  async findOne(email){
    const results = await db.query(`SELECT * FROM users WHERE email = $1`,[email])
    return results.rows[0]
  },
  async create(data){
    const query = `
      INSERT INTO users(
        name,
        email,
        password,
        is_admin
      ) VALUES ($1,$2,$3,$4)
    `
    try {
      const {username,useremail,administrador} = data

      const randomPassword = crypto.randomBytes(20).toString('hex')

      let isAdmin = administrador ? true : false

      const datas = [
        username,
        useremail,
        randomPassword,
        isAdmin
      ]

      return db.query(query,datas)

    } catch (error) {
      return res.render('admin/users/create',{
        error:`Ocorreu o seguinte erro ${error}.
        Tente novamente`
      })
    }

  },
  async findById(id){
    const result = await db.query(`SELECT * FROM users WHERE id = $1`,[id])
    return result.rows[0]
  },
  async update(id,data){
    try {
      const query = `
        UPDATE users SET
          name = ($1),
          email = ($2),
          password = ($3)
        WHERE id = ($4)
      `
      const values = [
        data.username,
        data.useremail,
        data.password,
        id
      ]

      return db.query(query,values)
    } catch (error) {
      console.log(`Ocorreu o seguinte erro ao tentar salvar ${error}`)
    }
  }
}
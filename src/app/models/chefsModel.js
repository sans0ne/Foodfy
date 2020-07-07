const db = require('../../config/db')
const { date } = require('../../libs/utils')

module.exports = {
    all(){
        return db.query(`SELECT chefs.*, files.path AS path
                         FROM chefs
                         LEFT JOIN files ON (chefs.file_id = files.id)`)
    },
    create(data,id){
        const query = `INSERT INTO chefs(
                       name,
                       created_at,
                       file_id      
                       ) VALUES ($1,$2,$3)
                       RETURNING id`


        const values = [
            data.name,
            date(Date.now()).iso,
            id
        ]

        return db.query(query,values)
    },
    findChefs(id){
        const query = `SELECT chefs.*, files.path AS path, COUNT(recipes) AS total_recipes FROM chefs
                       LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
                       LEFT JOIN files ON (chefs.file_id = files.id)
                       WHERE chefs.id = $1
                       GROUP BY chefs.id,files.path`

        return db.query(query,[id])
    },
    countRecipes(id){
        const query = `SELECT recipes.id,recipes.title,chefs.name FROM recipes
                       LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                       WHERE chefs.id = $1
                       GROUP BY chefs.id,recipes.id
                       ORDER BY recipes.created_at DESC`

        return db.query(query,[id])
    },
    update(data,id){
        const query = `UPDATE chefs SET
                        name = $1,
                        file_id = $2
                       WHERE id = $3`

        const values = [
            data.name,
            id,
            data.id
        ]
        
        return db.query(query,values)

    },
    delete(id){
        return db.query(`DELETE FROM chefs
                  WHERE chefs.id = $1`,[id])
    },
    findAvatar(id){
        return db.query(`SELECT chefs.file_id,files.path FROM chefs
                         LEFT JOIN files ON (chefs.file_id = files.id)
                         WHERE chefs.id = $1`,[id])
    }
}
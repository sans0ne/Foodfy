const db = require('../../config/db')
const { date } = require('../../libs/utils')

module.exports = {
    all(callback){
        db.query(`SELECT * FROM chefs`,function(err,results){
            if(err) throw `Database error ${err}`

            callback(results.rows)
        })
    },
    create(data,callback){
        const query = `INSERT INTO chefs(
                       name,
                       avatar_url,
                       created_at      
                       ) VALUES ($1,$2,$3)
                       RETURNING id`


        const values = [
            data.name,
            data.avatar_url,
            date(Date.now()).iso
        ]
        db.query(query,values,function(err){
            if(err) throw `Database error ${err}`

            callback()
        })
    },
    findChefs(id,callback){
        const query = `SELECT chefs.*, count(recipes) AS total_recipes from chefs
                       LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
                       WHERE chefs.id = $1
                       GROUP BY chefs.id`

        db.query(query,[id],function(err,results){
            if(err) throw `Database error ${err}`

            callback(results.rows[0])
        })
    },
    countRecipes(id,callback){
        const query = `SELECT recipes.id,recipes.title,recipes.image,chefs.name FROM recipes
                       LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                       WHERE chefs.id = $1
                       GROUP BY chefs.id,recipes.id`

        db.query(query,[id],function(err,results){
            if(err) throw `Database error ${err}`

            callback(results.rows)
        })
    },
    update(data,callback){
        const query = `UPDATE chefs SET
                        name = $1,
                        avatar_url = $2
                       WHERE id = $3`

        const values = [
            data.name,
            data.avatar_url,
            data.id
        ]
        
        db.query(query,values,function(err,results){
            if(err) throw `Database error ${err}`

            callback()
        })

    },
    delete(id,callback){
        db.query(`DELETE FROM chefs
                  WHERE chefs.id = $1`,[id],function(err,results){
                      if(err) throw `Database error ${err}`

                      callback()
                  })
    }
}
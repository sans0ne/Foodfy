const db = require('../../config/db')
const {date} = require('../../libs/utils')

module.exports = {
    all(callback){
        db.query(`SELECT recipes.*, chefs.name AS chef_name
                  FROM recipes
                  LEFT JOIN chefs ON (recipes.chef_id = chefs.id)`,function(err,results){
            if(err) throw `Database error: ${err}`

            callback(results.rows)
        })
    },
    find(id,callback){
        db.query(`SELECT recipes.*, chefs.name AS chef_name
                  FROM recipes
                  LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                  WHERE recipes.id = $1`,[id],function(err,results){
                      if(err) throw `Database error ${err}`

                      callback(results.rows[0])
                  })
    },
    create(data,callback){
        const query = `
                    INSERT INTO recipes(
                        chef_id,
                        image,
                        title,
                        ingredients,
                        preparation,
                        information,
                        created_at
                    ) VALUES ($1,$2,$3,$4,$5,$6,$7)
                      RETURNING ID`

        const values = [
            data.chef, //buscar pelo nome do chef
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).iso
        ]

        db.query(query,values,function(err,results){
            if(err) throw `Database error ${err}`

            callback()
        })
    },
    update(data,callback){
        const query = `
                    UPDATE recipes SET
                        chef_id = ($1),
                        image = ($2),
                        title = ($3),
                        ingredients = ($4),
                        preparation = ($5),
                        information = ($6)
                    WHERE id = ($7)`

        const values = [
            data.chef, //buscar pelo nome do chef
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.id
        ]

        db.query(query,values,function(err,results){
            if(err) throw `Database error ${err}`
            
            callback()
        })
    },
    delete(id,callback){
        db.query(`DELETE FROM recipes 
                  WHERE recipes.id = $1`,[id],function(err,results){
                      if(err) throw `Database error ${err}`

                      callback()
                  })
    },
    chefsOptions(callback){
        db.query('SELECT * FROM chefs',function(err,results){
            if(err) throw `Database error ${err}`

            callback(results.rows)
        })
    },
    chefsAndRecipes(callback){
        db.query(`SELECT chefs.*, count(recipes) AS total_recipes
                  FROM chefs
                  LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
                  GROUP BY chefs.id`,function(err,results){
                      if(err) throw `Database error ${err}`

                      callback(results.rows)
                  })
    },
    filtrar(filter,callback){
        const query = `SELECT recipes.*,chefs.name AS chef_name
                       FROM recipes
                       LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                       WHERE recipes.title ILIKE '%${filter}%'`

        db.query(query,function(err,results){
            if (err) throw `Database error ${err}`

            callback(results.rows)
        })
    },
    paginate(params){
        const {filter,limit,offset,callback} = params

        let query = ``,
            filterQuery = ``,
            totalQuery = `(
                SELECT count(*) FROM recipes
            ) AS total`

        if(filter){
            filterQuery = `
                WHERE recipes.title ILIKE '%${filter}%'`

            totalQuery = `(
                SELECT count(*) from recipes
                ${filterQuery}
            ) AS total`
        }
        query = `
            SELECT recipes.*,${totalQuery},chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            ${filterQuery}
            LIMIT $1 OFFSET $2`

        db.query(query,[limit,offset],function(err,results){
            if(err) throw `Database error ${err}`

            callback(results.rows)
        })
    }
}

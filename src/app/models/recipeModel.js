const db = require('../../config/db')
const {date} = require('../../libs/utils')

module.exports = {
    all(){
        return db.query(`SELECT recipes.*, chefs.name AS chef_name
                  FROM recipes
                  LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                  ORDER BY recipes.created_at DESC`)
    },
    find(id){
        return db.query(`SELECT recipes.*, chefs.name AS chef_name
                  FROM recipes
                  LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                  WHERE recipes.id = $1`,[id])
    },
    create(data){
        const query = `
                    INSERT INTO recipes(
                        chef_id,
                        title,
                        ingredients,
                        preparation,
                        information,
                        created_at
                    ) VALUES ($1,$2,$3,$4,$5,$6)
                      RETURNING ID`

        const values = [
            data.chef, //buscar pelo nome do chef
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).iso
        ]

        return db.query(query,values)
    },
    update(data){
        const query = `
                    UPDATE recipes SET
                        chef_id = ($1),
                        title = ($2),
                        ingredients = ($3),
                        preparation = ($4),
                        information = ($5)
                    WHERE id = ($6)`

        const values = [
            data.chef, //buscar pelo nome do chef
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.id
        ]

        return db.query(query,values)
    },
    delete(id){
        return db.query(`DELETE FROM recipes 
                  WHERE recipes.id = $1`,[id])
    },
    chefsOptions(){
        return db.query('SELECT * FROM chefs')
    },
    chefsAndRecipes(){
        return db.query(`SELECT chefs.*, count(recipes) AS total_recipes
                  FROM chefs
                  LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
                  GROUP BY chefs.id`)
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
            ORDER BY recipes.updated_at DESC
            LIMIT $1 OFFSET $2`

        db.query(query,[limit,offset],function(err,results){
            if(err) throw `Database error ${err}`

            callback(results.rows)
        })
    },
    findFiles(id){
        const query = `SELECT recipe_files.*, files.name,files.path
                       FROM recipe_files
                       LEFT JOIN files ON (recipe_files.file_id = files.id)
                       WHERE recipe_files.recipe_id = $1`

        return db.query(query,[id])
    },
    findFile(id){
        const query = `SELECT recipe_files.*, files.name,files.path
                       FROM recipe_files
                       LEFT JOIN files ON (recipe_files.file_id = files.id)
                       WHERE recipe_files.recipe_id = $1
                       LIMIT 1`

        return db.query(query,[id])
    }
}

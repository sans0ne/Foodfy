const db = require('../../config/db')
const fs = require('fs')

module.exports = {
    create({filename,path}) { //parametros podiam ser conforme metodo find

        const query=`INSERT INTO files(
            name,
            path
        ) VALUES ($1,$2)
        RETURNING id`

        const values = [
            filename,
            path
        ]

        return db.query(query,values)
    },
    find(filename){
        return db.query(`SELECT * FROM files
                       WHERE files.name = $1`,[filename])
    },
    async delete(id){
        try{
            const result = await db.query(`SELECT files.path FROM files 
                                           LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
                                           WHERE recipe_files.id = $1`,[id])
            const file = result.rows[0]

            //fs.unlinkSync(file.path)

            fs.unlink(file.path,(err)=>{
                if(err) throw err
            })

            return db.query('DELETE FROM recipe_files WHERE id = $1',[id])

        }catch(err){
            console.log(err)
        }
    },
    async deletefromFiles(id){
        try{
            const result = await db.query(`SELECT path FROM files
                                           WHERE id = $1`,[id])

            const file = result.rows[0]

            fs.unlink(file.path,(err)=>{
                if(err) throw console.log(`erro no delete ${err}`)
            })

            return db.query(`DELETE FROM files WHERE id = $1`,[id])

        }catch(err){
            console.log(`erro no delete 2 ${err}`)
        }
    }
}
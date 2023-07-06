const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const { dbConnection } = require('../database/config')

class Server{

    constructor(){
        this.app = express()
        this.port = process.env.PORT

        this.paths = {
            auth:       '/api/auth',
            categories: '/api/categorias',
            products:   '/api/productos',
            users:      '/api/usuarios',
            uploads:      '/api/uploads',
            search:     '/api/buscar'
        }

        // Conectar a la base de datos
        this.dbConnect()

        // Middlewares
        this.middlewares()

        // Rutas
        this.routes()
    }

    async dbConnect(){
        await dbConnection()
    }

    middlewares(){

        // Cors
        this.app.use( cors() )

        // Lectura y parseo del body
        this.app.use( express.json() )

        // Directorio público
        this.app.use( express.static('public'))

        // Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    routes(){
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.categories, require('../routes/categories'));
        this.app.use(this.paths.products, require('../routes/products'));
        this.app.use(this.paths.users, require('../routes/user'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
        this.app.use(this.paths.search, require('../routes/search'));
    }

    listen(){  
        this.app.listen(this.port, () => {
        console.log(`Servidor corriendo en puerto ${this.port}`)
        })
    }
}

module.exports = Server
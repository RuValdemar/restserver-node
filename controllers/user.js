const { response, request } = require('express')

const userGet = (req, res = request = response) => {

    const { q, name = "Sin nombre", apikey } = req.query

    res.json({
        msg: 'get API - controlador',
        q,
        name,
        apikey
    })
}

const userPost = (req, res) => {

    const { nombre, edad } = req.body

    res.status(201).json({
        msg: 'post API - controlador',
        nombre,
        edad
    })
}

const userPut = (req, res) => {

    const  id = req.params.id

    res.status(500).json({
        msg: 'put API - controlador',
        id
    })
    

}

const userDelete = (req, res) => {
    res.json({
        msg: 'delete API - controlador'
    })
}

module.exports = {
    userGet,
    userPost,
    userPut,
    userDelete
}
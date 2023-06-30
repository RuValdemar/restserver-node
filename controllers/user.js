const { response, request } = require('express')
const bcryptjs = require('bcryptjs')

const User = require('../models/user')

const userGet = async(req, res = request = response) => {

    const { limit = 5, from = 0 } = req.query
    const query = {state: true}

    const [total, users] =  await Promise.all([
        User.countDocuments(query),
        User.find(query)
        .skip( from)
        .limit( limit )
    ])

    res.json({
       total,
       users
    })
}

const userPost = async (req, res = response) => {

    const { name, email, password, role } = req.body
    const user = new User({ name, email, password, role })

    // Encriptar la constraeña
    const salt = bcryptjs.genSaltSync()
    user.password = bcryptjs.hashSync(password, salt)

    // Guardar en BD
    await user.save()

    res.status(201).json({
        user
    })
}

const userPut = async(req, res) => {

    const  id = req.params.id
    const {_id, password, google, email, ...resto} = req.body

    // Validar
    if (password) {
         // Encriptar la constraeña
        const salt = bcryptjs.genSaltSync()
        resto.password = bcryptjs.hashSync(password, salt)
    }

    const user = await User.findByIdAndUpdate(id, resto, {new: true})

    res.status(500).json({
        user
    })    

}

const userDelete = async(req, res) => {
    const  id = req.params.id

    // Borrado físico
    // const user = await User.findByIdAndDelete(id)

    // Cambiar de estado
    const user = await User.findByIdAndUpdate(id, {state: false}, {new: true})

    res.json({
        user
    })
}

module.exports = {
    userGet,
    userPost,
    userPut,
    userDelete
}
const { response } = require("express");
const bcriptjs = require('bcryptjs');

const User = require('../models/user')
const { generateJWT } = require("../helpers/generate-jwt");

const login = async(req, res = response) => {
    const { email, password} = req.body;

    try {

        // Verificar si el email existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(500).json({
                message:'Error en usuario o password'
            });
        }
        
        // Si usuario activo
        if ( !user.state){
            return res.status(400).json({
                message: 'Usuario no existe'
            });
        }

        // Verificar la contraseña
        const passwordValid = bcriptjs.compareSync( password, user.password);
        if ( !passwordValid) {
            return res.status(500).json({
                message: 'Error, verifique su contraseña'
            });
        }

        // Generar JWT
        const token = await generateJWT( user.id);

        res.json({
            user,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Hable con el ADMIN'
        });
    }
}

module.exports = login
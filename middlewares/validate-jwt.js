const { response } = require('express')
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validateJWT = async(req, res = response, next) => {
    const token = req.header('x-token');

    if ( !token ) {
        return res.status(401).json({
            message: 'No hay token en la petición'
        });
    }    

    try {

        const {uid} = jwt.verify(token, process.env.SECRET_KEY);

        // Leer el usuario correspondiente al UID
        const user = await User.findById(uid);

        if (!user) {
            return res.status(401).json({
                message: 'No existe el usuario'
            });
        }

        // Verficar si uid tiene estado en true
        if (!user.state) {
            return res.status(401).json({
                message: 'Token no válido - usuario con estado FALSE'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            message: 'Token no válido'
        });
    }
}

module.exports = {
    validateJWT
}
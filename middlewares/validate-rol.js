const { response } = require("express")

const isAdminRol = (req, res = response, next) => {

    if ( !req.user) {
        return res.status(500).json({
            message: 'Se quiere verificar el role sin validar el token'
        });
    }

    const {role, name} = req.user;

    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            message: `Error: ${ name } no es administrador`
        });
    }

    next();
}

const haveRole = (...roles) => {
    return (req, res = response, next) => {
        if ( !req.user) {
            return res.status(500).json({
                message: 'Se quiere verificar el role sin validar el token'
            });
        }

        if (!roles.includes(req.user.role)) {           
            return res.status(500).json({
                message: `El servicio require uno de estos roles ${ roles }`
            });
        }

        next();
    }
}

module.exports = {
    isAdminRol,
    haveRole
}
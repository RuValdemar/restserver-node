
const Role = require('../models/role')
const User = require('../models/user')

const isValidateRole = async(role = '') => {
    const existRole = await Role.findOne({ role })
    if (!existRole) {
        throw new Error(`El rol ${role} no está registrado en la DB`)
    }
}

const emailExist = async(email = '') => {
    const existEmail = await User.findOne({email})
    if (existEmail) {      
        throw new Error(`El correo ${email} ya existe`)
    }
}

const userIdExist = async(id) => {
    if(id.match(/^[0-9a-fA-F]{24}$/)){
        const userExist = await User.findById(id)
        if (!userExist) {
            throw new Error(`El ID ${id} no existe`)
        }
    }
}

module.exports = {
    isValidateRole,
    emailExist,
    userIdExist
}
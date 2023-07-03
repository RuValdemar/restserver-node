const cValidateFields = require('../middlewares/validate-fields');
const cValidateJWT = require('../middlewares/validate-jwt');
const cValidateRoles = require('../middlewares/validate-rol');

module.exports = {
    ...cValidateFields,
    ...cValidateJWT,
    ...cValidateRoles
}
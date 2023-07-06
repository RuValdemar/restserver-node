const cValidateFields = require('./validate-fields');
const cValidateJWT = require('./validate-jwt');
const cValidateRoles = require('./validate-rol');
const cValidateFile = require('./validate-file');

module.exports = {
    ...cValidateFields,
    ...cValidateJWT,
    ...cValidateRoles,
    ...cValidateFile
}
const { Router } = require('express')
const { userGet, userPost, userPut, userDelete } = require('../controllers/user')
const { check, query } = require('express-validator')
const { validateFields } = require('../middlewares/validate-fields')
const { isValidateRole, emailExist, userIdExist } = require('../helpers/db-validators')
const router = Router()

router.get('/', [
    query("limit", "El valor de 'limit' debe ser numérico")
        .isNumeric()
        .optional(),
    query("from", "El valor de 'from' debe ser numérico")
        .isNumeric()
        .optional(),
        validateFields
], userGet)

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe ser más de 6 letras').isLength({min: 6}),
    check('email').custom( emailExist ),
    check('role').custom( isValidateRole ),
    validateFields
], userPost)

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( userIdExist ),
    check('role').custom( isValidateRole ),
    validateFields
], userPut)

router.delete('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( userIdExist ),
    validateFields
], userDelete)

module.exports = router;
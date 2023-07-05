const { Router } = require('express')
const { check, query } = require('express-validator')
const { validateJWT, validateFields, isAdminRol } = require('../middlewares');
const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('../controllers/categories');
const { categoryExist } = require('../helpers/db-validators');

const router = Router();

router.get('/', getCategories);

router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(categoryExist),
    validateFields
], getCategory);

router.post('/', [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validateFields
], createCategory);

router.put('/:id', [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(categoryExist),
    validateFields
], updateCategory);

router.delete('/:id', [
    validateJWT,    
    isAdminRol,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(categoryExist),
    validateFields
], deleteCategory);

module.exports = router
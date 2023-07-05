const { Router } = require('express')
const { check, query } = require('express-validator')
const { validateJWT, validateFields, isAdminRol } = require('../middlewares');
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require('../controllers/products');
const { productExist, categoryExist } = require('../helpers/db-validators');

const router = Router();

router.get('/', getProducts);

router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(productExist),
    validateFields
], getProduct);

router.post('/', [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('category', 'La categoría es obligatorio').not().isEmpty(),
    check('category', 'La categoría no es válida').isMongoId(),
    check('category').custom( categoryExist),
    validateFields
], createProduct);

router.put('/:id', [
    validateJWT,    
    // check('id', 'No es un ID válido - categoría').isMongoId(),
    check('id').custom(productExist),
    validateFields
], updateProduct);

router.delete('/:id', [
    validateJWT,    
    isAdminRol,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(productExist),
    validateFields
], deleteProduct);

module.exports = router
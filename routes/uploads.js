const { Router } = require('express')
const { check, query } = require('express-validator')

const { validateFields, validateFile } = require('../middlewares');
const { loadFile, updateImage, showImage, updateImageCloudinary } = require('../controllers/uploads');
const { allowedExtensions } = require('../helpers');

const router = Router();

router.post('/', validateFile, loadFile );

router.put('/:colection/:id', [
    validateFile,
    check('id', 'El id debe ser válido').isMongoId(),
    check('colection').custom( c => allowedExtensions(c, ['usuarios', 'productos'] )),
    validateFields
], updateImageCloudinary);

router.get('/:colection/:id', [
    check('id', 'El id debe ser válido').isMongoId(),
    check('colection').custom( c => allowedExtensions(c, ['usuarios', 'productos'] )),
    validateFields
], showImage)

module.exports = router;
const { response } = require("express");
const { Product } = require('../models');

const getProducts = async(req, res = response) => {
    const { limit = 5, from = 0 } = req.query
    const query = {state: true}

    const [total, products] =  await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
        .populate('user', 'name')
        .populate('category', 'name')
        .skip( from)
        .limit( limit )
    ])

    res.json({
       total,
       products
    })
}

const getProduct = async(req, res = response) => {
    const { id } = req.params;
    const product = await Product.findById( id )
        .populate('user', 'name')
        .populate('category', 'name');
   
    res.json({
        product
    })
}

const createProduct = async(req, res = response) => {
    
    const { state, user, ...body } = req.body;
    const productDb = await Product.findOne({name: body.name.toUpperCase()});

    if (productDb) {
        return res.status(400).json({
            message: `El producto ${productDb.name} ya existe`
        });
    }    

    const data = {
        ...body,
        name: body.name.toUpperCase(),
        user: req.user._id
    }

    const product = new Product(data);
    await product.save();

    res.status(201).json(product);
}

const updateProduct = async(req, res = response) => {
    const {id} = req.params;
    const { state, user, ...data } = req.body;
   
    if (data.name) {
        data.name = data.name.toUpperCase();
    }
    
    data.user = req.user._id;
    const product = await Product.findByIdAndUpdate(id, data, { new: true });
    res.json( product );
}

const deleteProduct = async(req, res = response) => {
    const { id } = req.params;
    const productDeleted = await Product.findByIdAndUpdate(id, { state: false }, { new: true });
    res.json(productDeleted);
}

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
}
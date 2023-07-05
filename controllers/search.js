const { response } = require("express");
const { User, Category, Product } = require("../models");
const { ObjectId } = require('mongoose').Types;

const colections = [
    'categorias',
    'productos',
    'roles',
    'usuarios'
];

const searchUsers = async(term = '', res = response) => {
    const isMongoId = ObjectId.isValid(term);
    if (isMongoId) {
        const user = await User.findById(term);
        return res.json({
            results: (user) ? [user] : []
        });
    }

    const regex = new RegExp( term, 'i');
    const users = await User.find({
        $or: [
            {name: regex},
            {email: regex}
        ],
        $and: [{state: true }]
    });
    res.json({
        results: users
    });
}

const searchCategories = async(term = '', res = response) => {
    const isMongoId = ObjectId.isValid(term);
    if (isMongoId) {
        const category = await Category.findById(term);
        return res.json({
            results: (category) ? [category] : []
        });
    }

    const regex = new RegExp( term, 'i');
    const categories = await Category.find({name: regex, state: true});
      
    res.json({
        results: categories
    });
}

const searchProducts = async(term = '', res = response) => {
    const isMongoId = ObjectId.isValid(term);
    if (isMongoId) {
        const product = await Product.findById(term).populate('category', 'name');
        return res.json({
            results: (product) ? [product] : []
        });
    }

    const regex = new RegExp( term, 'i');
    const products = await Product.find({name: regex, state: true}).populate('category', 'name');
      
    res.json({
        results: products
    });
}

const search = (req, res = response) => {

    const { colection, term } = req.params;
    if (!colections.includes( colection)) {
        return res.status(400).json({
            message: `Las colecciones permitidas son: ${colections}`
        })
    }

    switch (colection) {
        case 'usuarios':
            searchUsers(term, res);
            break;

        case 'categorias':
            searchCategories(term, res);
            break;

        case 'productos':
            searchProducts(term, res);
            break;
    
        default:
            res.status(500).json({
                message: 'Se le olvido hacer esta búsqueda'
            })
    }
}

module.exports = {
    search
}
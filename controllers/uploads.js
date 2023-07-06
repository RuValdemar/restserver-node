const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL)

const { response } = require("express");
const { uploadFile } = require("../helpers");
const { User, Product } = require("../models");

const loadFile = async(req, res = response) => {     

    try {
        
        const name = await uploadFile(req.files, undefined, 'images');
        res.json({
            name
        })
    } catch (error) {
        res.status(400).json({error})
    }
}

const updateImage = async(req, res = response) => {
    
    const { id, colection } = req.params;

    let model;
    switch (colection) {
        case 'usuarios':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    message: `No existe usuario con ID ${id}`
                })
            }

            break;
        
        case 'productos':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    message: `No existe producto con ID ${id}`
                })
            }

            break;
    
        default:
            return res.status(500).json({
                message: 'Olvidé la validacion'
            })
            
    }

    // Borrar imagenes previas

    if (model.image) {
        const imagePath = path.resolve(__dirname, '../uploads', colection, model.image);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }

    const name = await uploadFile(req.files, undefined, colection);
    model.image = name;

    await model.save();

    res.json(model);
}

const updateImageCloudinary = async(req, res = response) => {
    
    const { id, colection } = req.params;

    let model;

    switch (colection) {
        case 'usuarios':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    message: `No existe usuario con ID ${id}`
                })
            }

            break;
        
        case 'productos':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    message: `No existe producto con ID ${id}`
                })
            }

            break;
    
        default:
            return res.status(500).json({
                message: 'Olvidé la validacion'
            })
            
    }

    // Borrar imagenes previas

    if (model.image) {
        const nameArray = model.image.split('/');
        const name = nameArray[nameArray.length - 1];
        const [public_id] = name.split('.');
        cloudinary.uploader.destroy( public_id );
    }

    const { tempFilePath } = req.files.file;
    const {secure_url} = await cloudinary.uploader.upload( tempFilePath );  
    model.image = secure_url;
    await model.save();
    res.json(model)
}

const showImage = async(req, res = response) => {

    const { id, colection } = req.params;

    let model;

    switch (colection) {
        case 'usuarios':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    message: `No existe usuario con ID ${id}`
                })
            }

            break;
        
        case 'productos':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    message: `No existe producto con ID ${id}`
                })
            }

            break;
    
        default:
            return res.status(500).json({
                message: 'Olvidé la validacion'
            })
            
    }

    // Borrar imagenes previas

    if (model.image) {
        const imagePath = path.resolve(__dirname, '../uploads', colection, model.image);
        if (fs.existsSync(imagePath)) {
            return res.sendFile( imagePath );
        }
    }

    const imagePath = path.resolve(__dirname, '../assets/no-image.jpg');    
    res.sendFile( imagePath );

}

module.exports = {
    loadFile,
    updateImage,
    updateImageCloudinary,
    showImage
}
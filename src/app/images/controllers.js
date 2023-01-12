require('dotenv').config();// для работы с .env
const { getReaponse } = require('../../helpers/responses.js');
const {
    uploadSingleImage,
    uploadMultipleImage,
    loadImages,
    loadImage,
    deleteAllImages,
    deleteImage
} = require('./models.js');



exports.uploadSingleImage = async (req, res) => {
    try {
        return await uploadSingleImage(req, res);
    } catch (error) {
        const message = getReaponse('DB-ERROR');
        return res.status(message.statusCode).json(message);
    }
}


exports.uploadMultipleImage = async (req, res) => {
    try {
       return await uploadMultipleImage(req, res);
    } catch (error) {
        const message = getReaponse('DB-ERROR')
        return res.status(message.statusCode).json(message)
    }
}


exports.loadImages = async (req, res) => {
    try {
        return await loadImages(req, res);
    } catch (error) {
        const message = getReaponse('DB-ERROR')
        return res.status(message.statusCode).json(message)
    }
}



exports.loadImage = async (req, res) => {
    try {
        return await loadImage(req, res);
    } catch (error) {
        const message = getReaponse('DB-ERROR')
        return res.status(message.statusCode).json(message);
    }
}


exports.deleteAllImages = async (req, res) => {
    try {
        return await deleteAllImages(req, res);
    } catch (error) {
        const message = getReaponse('DB-ERROR')
        return res.status(message.statusCode).json(message);
    }
}


exports.deleteImage = async (req, res) => {
    try {
       return await deleteImage(req, res);
    } catch (error) {
        console.log(error)
        const message = getReaponse('DB-ERROR')
        return res.status(message.statusCode).json(message)
    }
}

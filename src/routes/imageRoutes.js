const express = require('express');
// const router = express.Router();
// const client = require('../db/db.js');
// const controller = require('../controllers/imageControllers.js');
const { loadImages, loadImage, upload, uploadMultipleImage, uploadSingleImage, deleteAllImages, deleteImage } = require('../controllers/imageControllers.js');


const apiKeyChecker = require("../middleware/apiKeyChecker");
const tokenChecker = require("../middleware/tokenChecker");

module.exports = function (app) {
    //route to upload single image  
    // app.post('/upload/upload-single-image', controller.upload.single('icon'), controller.uploadSingleImage);
    //route to upload multiple image
    const maxCount = 20 // максимальное кол-во изображений для загрузки
    app.get('/images', apiKeyChecker, loadImages);
    app.get('/image/:id', apiKeyChecker, loadImage);
    app.post('/image', apiKeyChecker, tokenChecker, upload.single('image_path'), uploadSingleImage);
    app.post('/images', apiKeyChecker, tokenChecker, upload.array('image_path', maxCount), uploadMultipleImage);
    app.delete('/images', apiKeyChecker, tokenChecker, deleteAllImages);
    app.delete('/image/:id', apiKeyChecker, tokenChecker, deleteImage);  
};

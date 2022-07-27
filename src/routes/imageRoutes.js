const express = require('express');
// const router = express.Router();
// const client = require('../db/db.js');
const controller = require('../controllers/imageControllers.js');


const apiKeyChecker = require("../middleware/apiKeyChecker");
const tokenChecker = require("../middleware/tokenChecker");

module.exports = function (app) {
    //route to upload single image  
    // app.post('/upload/upload-single-image', controller.upload.single('icon'), controller.uploadSingleImage);
    //route to upload multiple image
    const maxCount = 20 // максимальное кол-во изображений для загрузки
    app.get('/images', apiKeyChecker, controller.loadImages);
    app.get('/image/:id', apiKeyChecker, controller.loadImage);
    app.post('/images', apiKeyChecker, tokenChecker, controller.upload.array('image_path', maxCount), controller.uploadMultipleImage);
    app.delete('/images', apiKeyChecker, tokenChecker, controller.deleteAllImages);
    app.delete('/image/:id', apiKeyChecker, tokenChecker, controller.deleteImage);  
};

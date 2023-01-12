const express = require('express');
const {
    loadImages,
    loadImage,
    uploadMultipleImage,
    deleteAllImages,
    deleteImage
} = require('./controllers');

const apiKeyChecker = require("../../middleware/apiKeyChecker");
const tokenChecker = require("../../middleware/tokenChecker");
const { multer } = require('./multer');

const maxCount = 20 // максимальное кол-во изображений для загрузки
module.exports = function (app) {
    app.get('/images', apiKeyChecker, loadImages);
    app.get('/image/:id', apiKeyChecker, loadImage);
    app.post('/images', apiKeyChecker, tokenChecker, multer.array('image_name', maxCount), uploadMultipleImage);
    app.delete('/images', apiKeyChecker, tokenChecker, deleteAllImages);
    app.delete('/image/:id', apiKeyChecker, tokenChecker, deleteImage);  
};

const express = require('express');
const {
    loadImages,
    loadImage,
    upload,
    uploadMultipleImage,
    uploadSingleImage,
    deleteAllImages,
    deleteImage
} = require('./controllers');

const apiKeyChecker = require("../../middleware/apiKeyChecker");
const tokenChecker = require("../../middleware/tokenChecker");

const maxCount = 20 // максимальное кол-во изображений для загрузки
module.exports = function (app) {
    app.get('/images', apiKeyChecker, loadImages);
    app.get('/image/:id', apiKeyChecker, loadImage);
    app.post('/image', apiKeyChecker, tokenChecker, upload.single('image_path'), uploadSingleImage);
    app.post('/images', apiKeyChecker, tokenChecker, upload.array('image_path', maxCount), uploadMultipleImage);
    app.delete('/images', apiKeyChecker, tokenChecker, deleteAllImages);
    app.delete('/image/:id', apiKeyChecker, tokenChecker, deleteImage);  
};

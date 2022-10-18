require('dotenv').config();// для работы с .env
const sizeOf = require('image-size');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const client = require('../db/db.js');
const { deleteAllImagesFiles } = require('../helpers/deleteAllImagesFiles');
const { getReaponse } = require('../helpers/responses.js');

const directory = process.env.IMAGES_PATH;

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `./${directory}`);
        const dimensions = sizeOf(`images/00ec92febdd7358c0b8481082ffe9c4f`)
        console.log('dimensions', dimensions)
    },
    filename: (req, file, cb) => {
        const image_id = Date.now()
        console.log('fileName', file.originalname)
        cb(null, `image-${image_id}` + path.extname(file.originalname))
    }
});

const multerFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
        return cb('Можно загрузить изображения только в PNG и JPG формате')
        // return cb(new Error('Можно загрузить изображения только в PNG и JPG формате'))
        const  message = getReaponse('EXTENSION-ERROR')
        return res.status(message.statusCode).json(message)
    }
    cb(null, true)
};

exports.upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});


exports.uploadSingleImage = async (req, res) => {
    const image_path = req.files[0].filename;

    console.log('uploadSingleImage image_path = ', image_path)

    // const allquery = await client.query
    // (`INSERT INTO laktime_images(image_id, image_path)  VALUES ('${req.body.name}', '${req.file.filename}')`);

    res.status(200).json({ 'statusCode': 200, 'ok': OK, message: 'Image added', 'data': [] });
}


exports.uploadMultipleImage = async (req, res) => {

    const len = req.files.length;

    if (len === 0) {
        res.status(400).json('Изображения не выбраны!')
        return
    }
    let message;
    const valuesArr = [];
    try {
        for (let i = 0; i < len; i++) {
            const image_path = req.files[i].filename
            const image_id = image_path.substring(6, image_path.length - 4);
            valuesArr.push(`('${image_id}','${image_path}')`)
        }
        const valuesStr = valuesArr.join(',')

        const query = await client.query(`INSERT INTO laktime_images(image_id, image_path) VALUES ${valuesStr}`);

        if(query.rowCount !== len) {
            message = getReaponse('DB-ERROR');
        } else {
            const query = await client.query(`SELECT * FROM laktime_images`);
            if(query.rowCount >= 0) message = getReaponse('OK', query.rows)
        }
        return res.status(message.statusCode).json(message)
    } catch (error) {
        message = getReaponse('DB-ERROR')
        return res.status(message.statusCode).json(message)
    }

}


exports.loadImages = async (req, res) => {
    let message;
    try {
        const query = await client.query(`SELECT * FROM laktime_images`);
        if (query.rowCount >= 0) {
            const data = query.rows;
            message = getReaponse('OK', data);
        } 
        return res.status(message.statusCode).json(message)
    } catch (error) {
        message = getReaponse('DB-ERROR')
        return res.status(message.statusCode).json(message)
    }    
}



exports.loadImage = async (req, res) => {
    let id = req.params.id;
    let message;
    try {
        const query = await client.query(`SELECT * FROM laktime_images WHERE image_id='${id}'`);
        if (query.rowCount >= 0) {
            const data = query.rows;
            message = getReaponse('OK', data);
        } 
        return res.status(message.statusCode).json(message)
    } catch (error) {
        message = getReaponse('DB-ERROR')
        return res.status(message.statusCode).json(message)
    }
}


exports.deleteAllImages = async (req, res) => {
    let message;
    let query;
    try {
        query = await client.query(`DELETE FROM laktime_images`);
        if (query.rowCount > 0) {
            deleteAllImagesFiles();
            message = getReaponse('OK');
        } else {
            message = getReaponse('NOT-FOUND')
        }
        return res.status(message.statusCode).json(message);
    } catch (error) {
        message = getReaponse('DB-ERROR')
        return res.status(message.statusCode).json(message)
    }
}


exports.deleteImage = async (req, res) => {
    let id = req.params.id;
    let message = getReaponse('DB-ERROR');
    try {
        let query = await client.query(`SELECT * FROM laktime_images WHERE image_id='${id}'`);
        if (query.rowCount === 1) {
            const fileName = query.rows[0].image_path;
            const filePath = `./${directory}/${fileName}`;
            
            query = await client.query(`DELETE FROM laktime_images WHERE image_id='${id}'`);
           
            if (query.rowCount === 1) {
                fs.unlinkSync(filePath);
                const query = await client.query(`SELECT * FROM laktime_images`);  
                message = getReaponse('OK', query?.rows)   
            }
        }
        return res.status(message.statusCode).json(message)
    } catch (error) {
        return res.status(message.statusCode).json(message)
    }   
}

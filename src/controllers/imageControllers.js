require('dotenv').config();// для работы с .env
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const client = require('../db/db.js');
const { deleteAllImagesFiles } = require('../helpers/deleteAllImagesFiles');
const { getReaponse } = require('../helpers/responses.js');

const directory = process.env.IMAGES_PATH; //путь к папке с изображениями

let image_id;

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `./${directory}`);
    },
    filename: (req, file, cb) => {
        image_id = Date.now()
        cb(null, `image-${image_id}` + path.extname(file.originalname))
        //path.extname get the uploaded file extension
    }
});

const multerFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
        // upload only png and jpg format
        return cb(new Error('Можно загрузить изображения только в PNG и JPG формате'))
    }
    cb(null, true)
};

exports.upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});


// exports.uploadSingleImage = async (req, res) => {
//     const allquery = await client.query(`INSERT INTO laktime_images(name, icon)  VALUES ('${req.body.name}', '${req.file.filename}')`);

//     res.status(200).json({ 'statusCode': 200, 'ok': OK, message: 'Image added', 'data': [] });
// }


exports.uploadMultipleImage = async (req, res) => {
    const len = req.files.length;
    if(len === 0) {
        res.status(400).json('Изображения не выбраны!')
    }
    let message;
    const data = []
    for (var i = 0; i < len; i++) {
        const image_path = req.files[i].filename
        const image_id = image_path.substring(6, image_path.length - 4);
        let query;
        try {
            query = await client.query(`INSERT INTO laktime_images(image_id, image_path) VALUES ('${image_id}','${image_path}')`);
        } catch (error) {
            console.log(error)
            message = getReaponse('DB-ERROR')
            return res.status(message.statusCode).json(message)
        }     
        if (query.rowCount === 1)  data.push({image_path})
    }

    if(len == data.length) {
        message = getReaponse('OK', data);
    } else {
        message = {'statusCode': 200, 'ok': false, message: `${data.length} изображений из ${req.files.length} были загружены`, 'data': data}
    }
    res.status(message.statusCode).json(message)
}


exports.loadImages = async (req, res) => {
    let message;
    let data;
    let query;
    try {
        query = await client.query(`SELECT * FROM laktime_images`);
        data = query.rows;
    } catch (error) {
        message = getReaponse('DB-ERROR')
        return res.status(message.statusCode).json(message)
    }
    
    if (query.rowCount >= 0) {  
        message = getReaponse('OK', data);
    }
    // else {
    //     message = getReaponse('NOT-FOUND');
    // }
    res.status(message.statusCode).json(message)
}



exports.loadImage = async (req, res) => {
    let id = req.params.id;
    let message;
    let data;
    let query;
    try {
        query = await client.query(`SELECT * FROM laktime_images WHERE image_id='${id}'`);
        data = query.rows;
    } catch (error) {
        message = getReaponse('DB-ERROR')
        return res.status(message.statusCode).json(message)
    }
    

    if (query.rowCount > 0) {
        message = getReaponse('OK', data);
    } else {
        message = getReaponse('NOT-FOUND');
    }
    res.status(message.statusCode).json(message)
}


exports.deleteAllImages = async (req, res) => {
    let message;
    let query;
    try {
        query = await client.query(`DELETE FROM laktime_images`);
    } catch (error) {
        message = getReaponse('DB-ERROR')
        return res.status(message.statusCode).json(message)
    }
    
    // console.log('query = ', query)

    if (query.rowCount > 0) {
        deleteAllImagesFiles();
        message = getReaponse('OK');
    } else {
        message = getReaponse('NOT-FOUND')
    }
    res.status(message.statusCode).json(message);
}


exports.deleteImage = async (req, res) => {
    let id = req.params.id;
    let message;
    let query;
    try {
        query = await client.query(`SELECT * FROM laktime_images WHERE image_id='${id}'`);
    } catch (error) {
        message = getReaponse('DB-ERROR')
        return res.status(message.statusCode).json(message)
    }

    

    if (query.rowCount === 1) {
        const fileName = query.rows[0].image_path;
        const filePath = `./${directory}/${fileName}`;
        try {
            query = await client.query(`DELETE FROM laktime_images WHERE image_id='${id}'`);
        } catch (error) {
            message = getReaponse('DB-ERROR')
            return res.status(message.statusCode).json(message)
        }
        
        if (query.rowCount === 1) {  
            fs.unlinkSync(filePath);
            message = getReaponse('OK');
        }
    } else {
        message = getReaponse('ERROR');
    }
    res.status(message.statusCode).json(message)
}

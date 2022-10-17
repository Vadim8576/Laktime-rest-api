const multer = require('multer');
const client = require('../db/db.js');
const { requestBodyFieldsChecker } = require('../helpers/requestBodyFieldsChecker.js');
const { getReaponse } = require('../helpers/responses.js');

const tableName = 'laktime_price';

// const directory = process.env.PRICE_IMAGES_PATH;

// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, `./${directory}`);
//     },
//     filename: (req, file, cb) => {
//         const image_name = Date.now()
//         cb(null, `image-${image_name}` + path.extname(file.originalname))
//         //path.extname get the uploaded file extension
//     }
// });

// const multerFilter = (req, file, cb) => {
//     if (!file.originalname.match(/\.(png|jpg)$/)) {
//         // upload only png and jpg format
//         return cb(new Error('Можно загрузить изображения только в PNG и JPG формате'))
//     }
//     cb(null, true)
// };

// const upload = multer({
//     storage: multerStorage,
//     fileFilter: multerFilter
// });


// const uploadPriceImage = async (image_name) => {
//     console.log('uploadSingleImage image_path = ', image_name)

//     // const allquery = await client.query
//     // (`INSERT INTO laktime_images(image_id, image_path)  VALUES ('${req.body.name}', '${req.file.filename}')`);

//     res.status(200).json({ 'statusCode': 200, 'ok': OK, message: 'Image added', 'data': [] });
// }



exports.addPrice = async (req, res) => {
    let message;
    const body = await requestBodyFieldsChecker(req, res, tableName);
    if(!body) return
    
    try {    
        const query = await client.query(`INSERT INTO ${tableName}
            (servicename, price, active, description) VALUES(
                '${body.servicename}',
                '${body.price}',
                '${body.active}',
                '${body.description}'
            )`
        );

        if (query.rowCount == 1) {
            const query = await client.query(`SELECT * FROM ${tableName}`);  
            message = getReaponse('OK', query?.rows);
        } else {
            message = getReaponse('ERROR');
        }
    } catch (error) {
        message = getReaponse('DB-ERROR');   
        console.log(error)
    }
    res.status(message.statusCode).json(message)
}


exports.getPrices = async (req, res) => {
    let message;
    try {
        const query = await client.query(`SELECT * FROM ${tableName};`);

        if (query.rowCount >= 0) {
            const data = query.rows;
            message = getReaponse('OK', data);
        } 
    } catch (error) {
        message = getReaponse('DB-ERROR'); 
    }
    res.status(message.statusCode).json(message)
}



exports.getPrice = async (req, res) => {
    const id = req.params.id;
    let message;

    try {
        const query = await client.query(`SELECT * FROM ${tableName} WHERE id='${id}'`);

        if (query.rowCount > 0) {
            const data = query.rows;
            message = getReaponse('OK', data);
        } else {
            message = getReaponse('NOT-FOUND');
        }
    } catch (error) {
        message = getReaponse('DB-ERROR');    
    }
    res.status(message.statusCode).json(message)
}


exports.deleteAllPrices = async (req, res) => {
    let message;

    try {
        const query = await client.query(`DELETE FROM ${tableName}`);
        if(query.rowCount > 0) {
            message = getReaponse('OK');
        } else {
            message = getReaponse('NOT-FOUND');
        }
    } catch (error) {
        message = getReaponse('DB-ERROR');   
    }
    res.status(message.statusCode).json(message);
}


exports.deletePrice = async (req, res) => {
    let id = req.params.id;
    let message;
    try {
        const query = await client.query(`DELETE FROM ${tableName} WHERE id='${id}'`);
        if(query.rowCount > 0) {
            const query = await client.query(`SELECT * FROM ${tableName}`);  
            message = getReaponse('OK', query?.rows) 
        } else {
            message = getReaponse('NOT-FOUND');
        } 
    } catch (error) {
        message = getReaponse('DB-ERROR'); 
    }
    res.status(message.statusCode).json(message)
}



exports.patchPrice = async (req, res) => {
    const id = req.params.id;
    let message;

    try {
        const body = await requestBodyFieldsChecker(req, res, tableName);
        if(!body) return
        const query = await client.query(
            `UPDATE ${tableName} SET
            servicename='${body.servicename}',
            price='${body.price}',
            active='${body.active}',
            description='${body.description}'
            WHERE id='${id}'`);
        if (query.rowCount == 1) {
            const query = await client.query(`SELECT * FROM ${tableName}`);  
            message = getReaponse('OK', query?.rows) 
        } else {
            message = getReaponse('NOT-FOUND');
        }
    } catch (error) {
        message = getReaponse('DB-ERROR'); 
    }
    res.status(message.statusCode).json(message)
}
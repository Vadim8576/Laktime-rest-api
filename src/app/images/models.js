const client = require('../../db/db.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { deleteAllImagesFiles } = require('../../helpers/deleteAllImagesFiles.js');
const { getReaponse } = require('../../helpers/responses.js');

const directory = process.env.IMAGES_PATH;
const tableName = 'laktime_images';

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, `./${directory}`);
  },
  filename: (req, file, cb) => {
      let image_id1 = Date.now();
      let image_id2 = Date.now();
      while (image_id1 === image_id2) {
          image_id2 = Date.now();
      }
      cb(null, `image-${image_id2}${path.extname(file.originalname)}`);
  }
});

const multerFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(png|jpg)$/)) {
      return cb(new Error('Можно загрузить изображения только в PNG и JPG формате'))
      // const  message = getReaponse('EXTENSION-ERROR')
      // return res.status(message.statusCode).json(message)
  }
  cb(null, true)
};

exports.multer = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});


exports.uploadSingleImage = async (req, res) => {
  const image_path = req.files[0].filename;
  // const allquery = await client.query
  // (`INSERT INTO laktime_images(image_id, image_path)  VALUES ('${req.body.name}', '${req.file.filename}')`);
  const message = getReaponse('DB-ERROR');
  return res.status(message.statusCode).json(message);
}

exports.uploadMultipleImage = async (req, res) => {
  let message;
  const files = req.files.length;
  if (files === 0) return res.status(400).json('Изображения не выбраны!');

  const valuesArr = [];
  for (let i = 0; i < files; i++) {
    const image_path = req.files[i].filename;
    const image_id = image_path.substring(6, image_path.length - 4);
    valuesArr.push(`('${image_id}','${image_path}')`);
  }
  const valuesStr = valuesArr.join(',');

  const query = await client.query(`INSERT INTO ${tableName} (image_id, image_path) VALUES ${valuesStr}`);

  if (query.rowCount === files) {
    const query = await client.query(`SELECT * FROM ${tableName}`);
    if (query.rowCount >= 0) {
      message = getReaponse('OK', query.rows);
    } else {
      message = getReaponse('DB-ERROR');
    }
  }

  return res.status(message.statusCode).json(message);
}


exports.loadImages = async (req, res) => {
  let message;
  const query = await client.query(`SELECT * FROM ${tableName}`);
  if (query.rowCount >= 0) {
    message = getReaponse('OK', query.rows);
  } else {
    message = getReaponse('DB-ERROR');
  }

  return res.status(message.statusCode).json(message);
}


exports.loadImage = async (req, res) => {
  let message;
  let id = req.params.id;
  if (!id) {
    message = getReaponse('PARAMS-WRONG');
    return res.status(message.statusCode).json(message);
  }

  const query = await client.query(`SELECT * FROM ${tableName} WHERE image_id='${id}'`);
  if (query.rowCount >= 0) {
    message = getReaponse('OK', query.rows);
  } else {
    message = getReaponse('DB-ERROR');
  }

  return res.status(message.statusCode).json(message);
}


exports.deleteAllImages = async (req, res) => {
  let message;
  const query = await client.query(`DELETE FROM ${tableName}`);

  if (query.rowCount > 0) {
    deleteAllImagesFiles();
    message = getReaponse('OK');
  } else {
    message = getReaponse('NOT-FOUND');
  }

  return res.status(message.statusCode).json(message);
}


exports.deleteImage = async (req, res) => {
  let message;

  let id = req.params.id;
  if (!id) {
    message = getReaponse('PARAMS-WRONG');
    return res.status(message.statusCode).json(message);
  }

  let query;
  query = await client.query(`SELECT * FROM ${tableName} WHERE id='${id}'`);
  if (query.rowCount < 1) {
    message = getReaponse('NOT-FOUND');
    return res.status(message.statusCode).json(message);
  }

  const fileName = query.rows[0].image_path;
  const filePath = `./${directory}/${fileName}`;

  query = await client.query(`DELETE FROM ${tableName} WHERE id='${id}'`);
  if (query.rowCount < 1) {
    message = getReaponse('NOT-FOUND');
    return res.status(message.statusCode).json(message);
  }

  fs.unlinkSync(filePath);

  query = await client.query(`SELECT * FROM ${tableName}`);
  if (query.rowCount >= 0) {
    message = getReaponse('OK', query.rows);
    return res.status(message.statusCode).json(message);
  }

  message = getReaponse('DB-ERROR');
  return res.status(message.statusCode).json(message);
}
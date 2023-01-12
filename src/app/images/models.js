const client = require('../../db/db.js');
const { deleteAllImagesFiles } = require('../../helpers/deleteAllImagesFiles.js');
const { getReaponse } = require('../../helpers/responses.js');
const fs = require('fs');

const tableName = 'laktime_images';
const directory = process.env.IMAGES_PATH;

exports.uploadMultipleImage = async (req, res) => {
  const files = req.files.length;
  if (files === 0) return res.status(400).json('Изображения не выбраны!');

  const valuesArr = [];
  for (let i = 0; i < files; i++) {
    const image_name = req.files[i].filename;
    const image_id = image_name.substring(6, image_name.length - 4);
    valuesArr.push(`('${image_id}','${image_name}')`);
  }
  const valuesStr = valuesArr.join(',');

  const query = await client.query(`INSERT INTO ${tableName} (image_id, image_name) VALUES ${valuesStr}`);

  let message;

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

  const query = await client.query(`SELECT * FROM ${tableName}`);

  let message;

  if (query.rowCount >= 0) {
    message = getReaponse('OK', query.rows);
  } else {
    message = getReaponse('DB-ERROR');
  }

  return res.status(message.statusCode).json(message);
}


exports.loadImage = async (req, res) => {
  let id = req.params.id;
  if (!id) {
    message = getReaponse('PARAMS-WRONG');
    return res.status(message.statusCode).json(message);
  }

  const query = await client.query(`SELECT * FROM ${tableName} WHERE image_id='${id}'`);

  let message;

  if (query.rowCount >= 0) {
    message = getReaponse('OK', query.rows);
  } else {
    message = getReaponse('DB-ERROR');
  }

  return res.status(message.statusCode).json(message);
}


exports.deleteAllImages = async (req, res) => {
  let query;
  let ids = req.query.ids;

  // console.log('!!!!!!!!!!!!!!')
  // console.log(ids)
  // console.log(typeof ids)

  let message;

  if(!ids) {
    query = await client.query(`DELETE FROM ${tableName} RETURNING image_name`);
    // console.log('Удаление всех из BD')
    // console.log('RETURNING', query.rows)
  } else {
    if (typeof ids === 'object') {
      ids = ids.join(',').trim();
    }
    query = await client.query(`DELETE FROM ${tableName} WHERE id IN (${ids}) RETURNING image_name`);
    // console.log('Удаление несколько из BD')
    // console.log('RETURNING', query.rows)
  }

  const files_path = query.rows;

  if (query.rowCount > 0) {
    try {
      deleteAllImagesFiles(files_path);
      const query = await client.query(`SELECT * FROM ${tableName}`);
      message = getReaponse('OK', query.rows)
    } catch (error) {
      message = getReaponse('SERVER-ERROR');
      return res.status(message.statusCode).json(message);
    }
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

  const fileName = query.rows[0].image_name;
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
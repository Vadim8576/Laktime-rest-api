const client = require('../../db/db.js');
const { deleteAllImagesFiles } = require('../../helpers/deleteAllImagesFiles.js');
const { getReaponse } = require('../../helpers/responses.js');


const tableName = 'laktime_services';


exports.uploadSingleImage = async (req, res) => {

  let err = false;

  try {
    if (!req.file) return true;

    console.log('файл: ', req.file)

    const image_name = req.file.filename;
    const image_id = image_name.substring(6, image_name.length - 4);

    const query = await client.query(
      `INSERT INTO laktime_services_image (image_id, image_name) VALUES ('${image_id}', '${image_name}')`);

    err = false;
  } catch (error) {
    err = true;
  }


  return err;
}



exports.addService = async (req, res) => {


  console.log('файл: ', req.file)

  const image_name = req.file ? req.file.filename : null;

  const body = JSON.parse(req.body.service);

  const { servicename, price, active, description } = body;

  const query = await client.query(
    `INSERT INTO ${tableName}
    (servicename, price, active, description, image_name)
    VALUES(
      '${servicename}',
      '${price}',
      '${active}',
      '${description}',
      '${image_name}'
    )`
  );

  if (query.rowCount == 1) {
    const query = await client.query(`SELECT * FROM ${tableName}`);
    const message = getReaponse('OK', query.rows);
    return res.status(message.statusCode).json(message);
  }

  const message = getReaponse('DB-ERROR');
  return res.status(message.statusCode).json(message);
}

exports.getServices = async (req, res) => {
  let message;
  let query;
  try {
    query = await client.query(`SELECT * FROM ${tableName};`);
  } catch (error) {
    message = getReaponse('DB-ERROR');
    return res.status(message.statusCode).json(message);
  }
  
  if (query.rowCount >= 0) {
    message = getReaponse('OK', query.rows);
  } else {
    message = getReaponse('DB-ERROR');
  }

  return res.status(message.statusCode).json(message);
}

exports.getService = async (req, res) => {
  let message;
  const id = req.params.id;
  if (!id) {
    message = getReaponse('PARAMS-WRONG');
    return res.status(message.statusCode).json(message);
  }

  let query;

  try {
    query = await client.query(`SELECT * FROM ${tableName} WHERE id='${id}'`);

  } catch (error) {
    message = getReaponse('DB-ERROR');
    return res.status(message.statusCode).json(message);
  }


  if (query.rowCount > 0) {
    message = getReaponse('OK', query.rows);
  } else {
    message = getReaponse('NOT-FOUND');
  }
  return res.status(message.statusCode).json(message);
}

exports.deleteAllServices = async (req, res) => {
  let message;
  let query;
  let ids = req.query.ids;

  console.log('req.query =', req.query)
  console.log(ids, typeof ids)


  if (!ids) {
    try {
      query = await client.query(`DELETE FROM ${tableName} RETURNING image_name`);
      console.log('Удаление всех из BD')
      console.log('RETURNING query', query)
      console.log('RETURNING', query.rows)
    } catch (error) {
      message = getReaponse('DB-ERROR');
      return res.status(message.statusCode).json(message);
    }
  } else {
    if (typeof ids === 'object') {
      ids = ids.join(',').trim();
    }
    try {
      query = await client.query(`DELETE FROM ${tableName} WHERE id IN (${ids}) RETURNING image_name`);
      console.log('Удаление несколько из BD')
      console.log('RETURNING', query.rows)
    } catch (error) {
      message = getReaponse('DB-ERROR');
      return res.status(message.statusCode).json(message);
    }
  }

  const files_path = query.rows;

  console.log('files_path = ', files_path)

  if (query.rowCount === 0) {
    message = getReaponse('NOT-FOUND');
    return res.status(message.statusCode).json(message);
  }

  try {
    deleteAllImagesFiles(files_path);
  } catch (error) {
    message = getReaponse('SERVER-ERROR');
    return res.status(message.statusCode).json(message);
  }

  try {
    query = await client.query(`SELECT * FROM ${tableName}`);
    message = getReaponse('OK', query.rows);
  } catch (error) {
    console.log(error)
    message = getReaponse('DB-ERROR');
  }

  return res.status(message.statusCode).json(message);
}

exports.deleteService = async (req, res) => {
  let message;
  const id = req.params.id;
  if (!id) {
    message = getReaponse('PARAMS-WRONG');
    return res.status(message.statusCode).json(message);
  }

  let query;

  try {
    query = await client.query(`DELETE FROM ${tableName} WHERE id='${id}' RETURNING image_name`);
  } catch (error) {
    message = getReaponse('DB-ERROR');
    return res.status(message.statusCode).json(message);
  }

  const files_path = query.rows;

  if (query.rowCount === 0) {
    message = getReaponse('NOT-FOUND');
    return res.status(message.statusCode).json(message);
  }

  try {
    deleteAllImagesFiles(files_path);
  } catch (error) {
    message = getReaponse('SERVER-ERROR');
    return res.status(message.statusCode).json(message);
  }

  try {
    query = await client.query(`SELECT * FROM ${tableName}`);
    message = getReaponse('OK', query.rows)
  } catch (error) {
    message = getReaponse('DB-ERROR');
  }

  return res.status(message.statusCode).json(message);
}




exports.patchService = async (req, res) => {
  let message;

  let id = req.params.id;
  if (!id) {
    message = getReaponse('PARAMS-WRONG');
    return res.status(message.statusCode).json(message);
  }

  let image_name = req.file ? req.file.filename : null;


  const body = JSON.parse(req.body.service);
  const { servicename, price, active, description } = body;
  let files_path;

  let query;

  try {
    query = await client.query(`SELECT * FROM ${tableName} WHERE id='${id}'`);
  } catch (error) {
    message = getReaponse('DB-ERROR');
    return res.status(message.statusCode).json(message);
  }

  if (query.rowCount > 0) {
    files_path = query.rows;
  } else {
    message = getReaponse('NOT-FOUND');
    return res.status(message.statusCode).json(message);
  }

  try {
    query = await client.query(`
      UPDATE ${tableName}
      SET
      servicename='${servicename}',
      price='${price}',
      active='${active}',
      description='${description}',
      image_name='${image_name ? image_name : files_path[0].image_name}'
      WHERE id='${id}'
    `);
  } catch (error) {
    message = getReaponse('DB-ERROR');
    return res.status(message.statusCode).json(message);
  }


  if (query.rowCount === 0) {
    message = getReaponse('NOT-FOUND');
    return res.status(message.statusCode).json(message);
  }

  try {
    const query = await client.query(`SELECT * FROM ${tableName}`);
    message = getReaponse('OK', query.rows)
  } catch (error) {
    message = getReaponse('DB-ERROR');
    return res.status(message.statusCode).json(message);
  }

  if (!image_name) {
    return res.status(message.statusCode).json(message);
  }

  try {
    deleteAllImagesFiles(files_path);
  } catch (error) {
    message = getReaponse('SERVER-ERROR');
  }

  return res.status(message.statusCode).json(message);
}
const client = require('../../db/db.js');
const { getReaponse } = require('../../helpers/responses.js');

const tableName = 'laktime_services';

exports.addService = async (req, res) => {
  const {servicename, price, active, description} = req.body;
  const query = await client.query(
    `INSERT INTO ${tableName}
    (servicename, price, active, description)
    VALUES(
      '${servicename}',
      '${price}',
      '${active}',
      '${description}'
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
  const query = await client.query(`SELECT * FROM ${tableName};`);
  if(query.rowCount >= 0) {
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

  const query = await client.query(`SELECT * FROM ${tableName} WHERE id='${id}'`);

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

  // console.log(req.query)
  // console.log(ids, typeof ids)

  if(ids && typeof ids === 'object') {
    ids = ids.join(',').trim();
  }

  if(ids) {
    query = await client.query(`DELETE FROM ${tableName} WHERE id IN (${ids})`)  
  } else {
    query = await client.query(`DELETE FROM ${tableName}`);
  }
  
  if (query.rowCount > 0) {
    const query = await client.query(`SELECT * FROM ${tableName}`);
    message = getReaponse('OK', query.rows)
  } else {
    message = getReaponse('NOT-FOUND');
  }
  return res.status(message.statusCode).json(message);
}

exports.deleteService= async (req, res) => {
  let message;
  const id = req.params.id;
  if (!id) {
    message = getReaponse('PARAMS-WRONG');
    return res.status(message.statusCode).json(message);
  }

  const query = await client.query(`DELETE FROM ${tableName} WHERE id='${id}'`);
  if (query.rowCount === 1) {
    const query = await client.query(`SELECT * FROM ${tableName}`);
    message = getReaponse('OK', query.rows)
  } else {
    message = getReaponse('NOT-FOUND');
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

  const {servicename, price, active, description} = req.body;

  const query = await client.query(`
    UPDATE ${tableName}
    SET
    servicename='${servicename}',
    price='${price}',
    active='${active}',
    description='${description}'
    WHERE id='${id}'
  `);

  if (query.rowCount == 1) {
    const query = await client.query(`SELECT * FROM ${tableName}`);
    message = getReaponse('OK', query.rows)
  } else {
    message = getReaponse('NOT-FOUND');
  }
  return res.status(message.statusCode).json(message);
}
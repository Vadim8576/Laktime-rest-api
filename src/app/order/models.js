const client = require('../../db/db.js');
const { getReaponse } = require('../../helpers/responses.js');

const tableName = 'laktime_order';

exports.addOrder = async (body, res) => {
  const { service, complited, date, time, name, telephone, email, comment } = body;
  const query = await client.query(`
    INSERT INTO ${tableName}
    (service, complited, date, time, name, telephone, email, comment)
    VALUES (
      '${service}',
      '${complited}',
      '${date}',
      '${time}',
      '${name}',
      '${telephone}',
      '${email}',
      '${comment}
    ')`
  );

  if(query.rowCount === 1) {
    const query = await client.query(`SELECT * FROM ${tableName}`);
    const message = getReaponse('OK', query.rows);
    return res.status(message.statusCode).json(message);
  } 

  const message = getReaponse('DB-ERROR');
  return res.status(message.statusCode).json(message);
}

exports.getPrices = async (req, res) => {
  let message;
  const query = await client.query(`SELECT * FROM ${tableName};`);
  if (query.rowCount >= 0) {
    message = getReaponse('OK', query.rows);
  } else {
    message = getReaponse('DB-ERROR');
  }

  return res.status(message.statusCode).json(message);
}

exports.getPrice = async (req, res) => {
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

exports.deleteAllPrices = async (req, res) => {
  let message;
  const query = await client.query(`DELETE FROM ${tableName}`);
  if (query.rowCount > 0) {
    message = getReaponse('OK');
  } else {
    message = getReaponse('NOT-FOUND');
  }
  return res.status(message.statusCode).json(message);
}

exports.deletePrice = async (req, res) => {
  let message;
  let id = req.params.id;
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

exports.patchPrice = async (body, res) => {
  let message;

  let id = req.params.id;
  if (!id) {
    message = getReaponse('PARAMS-WRONG');
    return res.status(message.statusCode).json(message);
  }

  const { servicename, price, active, description } = body;

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
const client = require('../../db/db.js');
const { requestBodyFieldsChecker } = require('../../helpers/requestBodyFieldsChecker.js');
const { getReaponse } = require('../../helpers/responses.js');
const { addOrder } = require('./models.js');
const tableName = 'laktime_order'

exports.addOrder = async (req, res) => {
    try {
        let body = await requestBodyFieldsChecker(req, res)
        if (!body) return
        return await addOrder
    } catch (error) {
        console.log(error)
        const message = getReaponse('DB-ERROR');
        res.status(message.statusCode).json(message)
    }
}


exports.getOrders = async (req, res) => {
    let message;

    try {
        const query = await client.query(`SELECT * FROM ${tableName}`);

        if (query.rowCount >= 0) {
            let data = query.rows;
            message = getReaponse('OK', data);
        }
        // else {
        //     message = getReaponse('NOT-FOUND');
        // }
    } catch (error) {
        // message = { 'statusCode': 200, 'ok': false, message: error }; 
        message = getReaponse('DB-ERROR');
    }
    res.status(message.statusCode).json(message)
}


exports.getOrder = async (req, res) => {
    let id = req.params.id;
    let message;

    try {
        const query = await client.query(`SELECT * FROM ${tableName} WHERE id='${id}'`);

        if (query.rowCount > 0) {
            const data = query.rows;
            // message = { 'statusCode': 200, 'ok': true, message: `Order with ID=${id} is loaded`, 'data': data }
            message = getReaponse('OK', data);
        } else {
            // message = { 'statusCode': 200, 'ok': false, message: `Order with ID=${id} not found`, 'data': null }
            message = getReaponse('NOT-FOUND');
        }
    } catch (error) {
        // message = { 'statusCode': 200, 'ok': false, message: error };
        message = getReaponse('DB-ERROR');
    }
    res.status(message.statusCode).json(message)
}


exports.deleteAllOrders = async (req, res) => {
    let message;

    try {
        const query = await client.query(`DELETE FROM ${tableName}`);
        if (query.rowCount > 0) {
            // message = { 'statusCode': 200, 'ok': true, message: 'All orders is removed' }
            message = getReaponse('OK');
        } else {
            // message = { 'statusCode': 200, 'ok': false, message: `Orders not found` };
            message = getReaponse('NOT-FOUND');
        }
    } catch (error) {
        // message = { 'statusCode': 200, 'ok': false, message: error }
        message = getReaponse('DB-ERROR');
    }
    res.status(message.statusCode).json(message);
}


exports.deleteOrder = async (req, res) => {
    let id = req.params.id;
    let message;
    try {
        let query = await client.query(`DELETE FROM ${tableName} WHERE id='${id}'`);
        if (query.rowCount > 0) {
            // message = { 'statusCode': 200, 'ok': true, message: `Order with id=${id} is removed` }
            message = getReaponse('OK');
        } else {
            // message = { 'statusCode': 200, 'ok': false, message: `Order with id=${id} not found` }
            message = getReaponse('NOT-FOUND');
        }
    } catch (error) {
        // message = { 'statusCode': 200, 'ok': false, message: `Price with id=${id} not found` };
        message = getReaponse('DB-ERROR');
    }
    res.status(message.statusCode).json(message)
}



exports.patchOrder = async (req, res) => {
    let id = req.params.id;
    let message;

    let body = await requestBodyFieldsChecker(req, res, tableName).then(response => response)
    if (!body) return

    try {
        const query = await client.query(`UPDATE ${tableName} SET
            service='${body.service}',
            complited='${body.complited}',
            date='${body.date}',
            time='${body.time}',
            name='${body.name}',
            telephone='${body.telephone}',
            email='${body.email}',
            comment='${body.comment}'
            WHERE id='${id}'`
        );

        if (query.rowCount > 0) {
            message = getReaponse('OK');
        } else {
            message = getReaponse('NOT-FOUND');
        }

    } catch (error) {
        console.log(error)
        message = getReaponse('DB-ERROR');
    }
    res.status(message.statusCode).json(message)
}


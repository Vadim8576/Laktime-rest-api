const client = require('../db/db.js');
const { requestBodyFieldsChecker } = require('../helpers/requestBodyFieldsChecker.js');
const { getReaponse } = require('../helpers/responses.js');

const tableName = 'laktime_price';

exports.addPrice = async (req, res) => {
    let message;
    let body = await requestBodyFieldsChecker(req, res, tableName).then(response => response)
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
            message = getReaponse('OK');
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
        // message = { 'statusCode': 200, 'ok': false, message: error };
        message = getReaponse('DB-ERROR'); 
    }
    res.status(message.statusCode).json(message)
}



exports.getPrice = async (req, res) => {
    let id = req.params.id;
    let message;

    try {
        const query = await client.query(`SELECT * FROM ${tableName} WHERE id='${id}'`);

        if (query.rowCount > 0) {
            const data = query.rows;
            // message = { 'statusCode': 200, 'ok': true, message: `Price with ID=${id} is loaded`, 'data': data }
            message = getReaponse('OK', data);
        } else {
            // message = { 'statusCode': 200, 'ok': false, message: `Price with ID=${id} not found`, 'data': null }
            message = getReaponse('NOT-FOUND');
        }
    } catch (error) {
        // message = { 'statusCode': 200, 'ok': false, message: error };
        message = getReaponse('DB-ERROR');    
    }
    res.status(message.statusCode).json(message)
}


exports.deleteAllPrices = async (req, res) => {
    let message;

    try {
        const query = await client.query(`DELETE FROM ${tableName}`);
        if(query.rowCount > 0) {
            // message = { 'statusCode': 200, 'ok': true, message: 'All prices is removed' }
            message = getReaponse('OK');
        } else {
            // message = { 'statusCode': 200, 'ok': false, message: `Prices not found` };
            message = getReaponse('NOT-FOUND');
        }
        
    } catch (error) {
        // message = { 'statusCode': 200, 'ok': false, message: error }
        message = getReaponse('DB-ERROR');   
    }
    res.status(message.statusCode).json(message);
}


exports.deletePrice = async (req, res) => {
    let id = req.params.id;
    let message;
    try {
        let query = await client.query(`DELETE FROM ${tableName} WHERE id='${id}'`);

        if(query.rowCount > 0) {
            // message = { 'statusCode': 200, 'ok': true, message: `Price with id=${id} is removed` }

            message = getReaponse('OK');
        } else {
            // message = { 'statusCode': 200, 'ok': false, message: `Price with id=${id} not found` }
            message = getReaponse('NOT-FOUND');
        } 
    } catch (error) {
        // message = { 'statusCode': 200, 'ok': false, message: `Price with id=${id} not found` };
        message = getReaponse('DB-ERROR'); 
    }
    res.status(message.statusCode).json(message)
}



exports.patchPrice = async (req, res) => {
    const id = req.params.id;
    let message;

    try {
        let body = await requestBodyFieldsChecker(req, res, tableName).then(response => response)
        if(!body) return


        console.log(body)

        const query = await client.query(
            `UPDATE ${tableName} SET
            servicename='${body.servicename}',
            price='${body.price}',
            active='${body.active}',
            description='${body.description}'
            WHERE id='${id}'`);
        if (query.rowCount > 0) {
            message = getReaponse('OK');
        } else {
            message = getReaponse('NOT-FOUND');
        }
    } catch (error) {
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!')
        message = getReaponse('DB-ERROR'); 
    }
    res.status(message.statusCode).json(message)
}
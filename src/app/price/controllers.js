const client = require('../../db/db.js');
const { requestBodyFieldsChecker } = require('../../helpers/requestBodyFieldsChecker.js');
const { getReaponse } = require('../../helpers/responses.js');
const { addPrice, getPrices, getPrice, deleteAllPrices, deletePrice, patchPrice } = require('./models.js');

const tableName = 'laktime_price';

exports.addPrice = async (req, res) => {
    try {
        const body = await requestBodyFieldsChecker(req, res, tableName);
        if (!body) return
        return await addPrice(body, res)
    } catch (error) {
        const message = getReaponse('DB-ERROR');
        return res.status(message.statusCode).json(message)
    }
}


exports.getPrices = async (req, res) => {
    let message;
    try {
       return await getPrices(req, res);
    } catch (error) {
        message = getReaponse('DB-ERROR');
        res.status(message.statusCode).json(message)
    }
    
}


exports.getPrice = async (req, res) => {
    try {
        return getPrice(req, res);
    } catch (error) {
        const message = getReaponse('DB-ERROR');
        res.status(message.statusCode).json(message)
    }
}


exports.deleteAllPrices = async (req, res) => {
    try {
        return await deleteAllPrices(req, res);
    } catch (error) {
        const message = getReaponse('DB-ERROR');
        return res.status(message.statusCode).json(message);
    }
}


exports.deletePrice = async (req, res) => {
    try {
        return await deletePrice(req, res);
    } catch (error) {
        message = getReaponse('DB-ERROR');
        return res.status(message.statusCode).json(message)
    }
}


exports.patchPrice = async (req, res) => {
    try {
        const body = await requestBodyFieldsChecker(req, res, tableName);
        if (!body) return
        return await patchPrice(body, res);
    } catch (error) {
        const message = getReaponse('DB-ERROR');
        return res.status(message.statusCode).json(message)
    }
}
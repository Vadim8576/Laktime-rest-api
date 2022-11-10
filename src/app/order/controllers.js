const client = require('../../db/db.js');
const { requestBodyFieldsChecker } = require('../../helpers/requestBodyFieldsChecker.js');
const { getReaponse } = require('../../helpers/responses.js');
const {
    addOrder,
    getOrders,
    getOrder,
    deleteAllOrders,
    deleteOrder
} = require('./models.js');

const tableName = 'laktime_order'

exports.addOrder = async (req, res) => {
    try {
        let body = await requestBodyFieldsChecker(req, res)
        if (!body) return
        return await addOrder(req, res);
    } catch (error) {
        console.log(error)
        const message = getReaponse('DB-ERROR');
        res.status(message.statusCode).json(message)
    }
}


exports.getOrders = async (req, res) => {
    try {
       return await getOrders(req, res);
    } catch (error) {
        const message = getReaponse('DB-ERROR');
        return res.status(message.statusCode).json(message)
    }
}


exports.getOrder = async (req, res) => {
    try {
        return await getOrder(req, res);
    } catch (error) {
        const message = getReaponse('DB-ERROR');
        return res.status(message.statusCode).json(message)
    }
    
}


exports.deleteAllOrders = async (req, res) => {
    try {
        return await deleteAllOrders(req, res);
    } catch (error) {
        const message = getReaponse('DB-ERROR');
        return res.status(message.statusCode).json(message)
    }
}


exports.deleteOrder = async (req, res) => {
    try {
        return await deleteOrder(req, res);
    } catch (error) {
        const message = getReaponse('DB-ERROR');
        return res.status(message.statusCode).json(message)
    }
}


exports.patchOrder = async (req, res) => {
    try {
        let body = await requestBodyFieldsChecker(req, res, tableName);
        if (!body) return
        return await patchOrder(body, res);
    } catch (error) {
        const message = getReaponse('DB-ERROR');
        return res.status(message.statusCode).json(message)
    }
}


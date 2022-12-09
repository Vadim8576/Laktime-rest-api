const { requestBodyFieldsChecker } = require('../../helpers/requestBodyFieldsChecker.js');
const { getReaponse } = require('../../helpers/responses.js');
const { addService, getServices, getService, deleteAllServices, deleteService, patchService } = require('./models.js');

const tableName = 'laktime_services';


exports.addService = async (req, res) => {
    try {
        // keys = Object.keys(req.body);
        // console.log('body keys = ', keys)
        const body = await requestBodyFieldsChecker(req, res, tableName);
        if (!body) return
        return await addService(req, res)
    } catch (error) {
        const message = getReaponse('DB-ERROR');
        return res.status(message.statusCode).json(message)
    }
}


exports.getServices = async (req, res) => {
    let message;
    try {
       return await getServices(req, res);
    } catch (error) {
        message = getReaponse('DB-ERROR');
        res.status(message.statusCode).json(message)
    }
    
}


exports.getService = async (req, res) => {
    try {
        return getService(req, res);
    } catch (error) {
        const message = getReaponse('DB-ERROR');
        res.status(message.statusCode).json(message)
    }
}


exports.deleteAllServices = async (req, res) => {
    try {
        return await deleteAllServices(req, res);
    } catch (error) {
        const message = getReaponse('DB-ERROR');
        return res.status(message.statusCode).json(message);
    }
}


exports.deleteService = async (req, res) => {
    try {
        return await deleteService(req, res);
    } catch (error) {
        message = getReaponse('DB-ERROR');
        return res.status(message.statusCode).json(message)
    }
}


exports.patchService = async (req, res) => {
    try {
        const body = await requestBodyFieldsChecker(req, res, tableName);
        if (!body) return
        return await patchService(req, res);
    } catch (error) {
        const message = getReaponse('DB-ERROR');
        return res.status(message.statusCode).json(message)
    }
}
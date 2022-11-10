const { getReaponse } = require("../../../helpers/responses.js");
const { requestBodyFieldsChecker } = require("../../../helpers/requestBodyFieldsChecker.js");
const { registerUser } = require("./model.js");
const tableName = 'laktime_users';

exports.register = async (req, res) => {
    try { 
        const body = await requestBodyFieldsChecker(req, res, tableName)      
        if(!body) return;
        return await registerUser(req, res);
    } catch (err) {
        const message = getReaponse('DB-ERROR');
        res.status(message.statusCode).json(message);
    };
}

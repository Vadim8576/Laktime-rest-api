const { getReaponse } = require("../../helpers/responses.js");
const { sendMail } = require('./model.js');

exports.mail = async (req, res) => { 
    try {
        await sendMail(req, res);
        const message = getReaponse('MAIL-OK');
        return res.status(message.statusCode).json(message);
    } catch (error) {
        const message = getReaponse('MAIL-ERROR');
        res.status(message.statusCode).json(message)
    }
    
}
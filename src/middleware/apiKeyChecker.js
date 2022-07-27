const jwt = require("jsonwebtoken");
const { getReaponse } = require("../helpers/responses");

module.exports = (req, res, next) => { 
    const apikey = req.headers['api-key'] || null;
    if(apikey !== process.env.API_KEY) {
        const message = getReaponse('API-KEY-WRONG');
        return res.status(message.statusCode).json(message);
    }
    next();
};
const jwt = require("jsonwebtoken");
const { getReaponse } = require("../helpers/responses");

module.exports = (req, res, next) => { 
    const apikey = req.headers['refresh-token-api-key'] || null;
    if(apikey !== process.env.REFRESH_TOKEN_API_KEY) {
        const message = getReaponse('REFRESH-API-KEY-WRONG');
        return res.status(message.statusCode).json(message);
    }

    
    next();
};
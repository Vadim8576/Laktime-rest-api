const jwt = require("jsonwebtoken");
const { getReaponse } = require("../helpers/responses");

module.exports = (req, res, next) => { 

    const body = req.body || null;

    console.log('body', body)

    if(body) {
        for(const key in body) {
            if(!body[key]) {
                const message = getReaponse('BODY-WRONG');
                return res.status(message.statusCode).json(message);
            }
        }
    }
    
    next();
};
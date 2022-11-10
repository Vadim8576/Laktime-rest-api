const jwt = require("jsonwebtoken");
const { getReaponse } = require("../helpers/responses");

const tokenHeaderName = 'Authorization';

module.exports = (req, res, next) => {
    let token = req.header(tokenHeaderName);
    const message = getReaponse('ACCESS-DENIED');
    if (!token) return res.status(message.statusCode).json(message);
   
    try {   
        token = token.slice(7);
        const decoded = jwt.verify(token, process.env.API_KEY);
        next();
    } catch (error) {
        const message = getReaponse('TOKEN-WRONG');
        res.status(message.statusCode).json(message);
    }
};
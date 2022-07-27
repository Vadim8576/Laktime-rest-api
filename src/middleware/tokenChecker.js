const jwt = require("jsonwebtoken");
const { getReaponse } = require("../helpers/responses");

module.exports = (req, res, next) => {
    const token = req.header("x-access-token");
    try {
        const message = getReaponse('ACCESS-DENIED');
        if (!token) return res.status(message.statusCode).json(message);
        const decoded = jwt.verify(token, process.env.API_KEY);
        next();
    } catch (error) {
        const message = getReaponse('TOKEN-WRONG');
        res.status(message.statusCode).json(message);
    }
};
const jwt = require("jsonwebtoken");
const { getReaponse } = require("../helpers/responses");

module.exports = (req, res, next) => {
    const refreshToken = req.header("x-refresh-token");
    try {
        const message = getReaponse('ACCESS-DENIED');
        if (!refreshToken) return res.status(message.statusCode).json(message);
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_API_KEY);
        next();
    } catch (error) {
        const message = getReaponse('TOKEN-WRONG');
        res.status(message.statusCode).json(message);
    }
};
const bcrypt = require("bcrypt");
require('dotenv').config(); // для работы с .env
const client = require('../../db/db.js');
const jwt = require("jsonwebtoken");
const { tokensCreator } = require("../../helpers/tokensCreator.js");
const { getReaponse } = require("../../helpers/responses.js");
const { refreshTokenModel } = require("./model.js");


exports.refreshToken = async (req, res) => {
    const { email } = req.body;
    if (email == '' || email == null) {
        const message = getReaponse('BODY-WRONG');
        return res.status(message.statusCode).json(message);
    }
    try {
        return refreshTokenModel(req, res, email);
    } catch (err) {
        const message = getReaponse('SERVER-ERROR');
        res.status(message.statusCode).json(message);
    };
};
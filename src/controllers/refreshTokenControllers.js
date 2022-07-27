const bcrypt = require("bcrypt");
require('dotenv').config(); // для работы с .env
const client = require('../db/db.js');
const jwt = require("jsonwebtoken");
const { tokensCreator } = require("../helpers/tokensCreator.js");
const { getReaponse } = require("../helpers/responses.js");


exports.refreshToken = async (req, res) => {
    const {email} = req.body;
    const refreshToken = req.header("x-refresh-token");

    if(email == '' || email == null) {
        const message = getReaponse('BODY-WRONG');
        return res.status(message.statusCode).json(message);
    }

    try {
        const query = await client.query(`SELECT * FROM laktime_token;`)
        const oldTtoken = query.rows[0].token;

        if ((refreshToken) && (refreshToken === oldTtoken)) {
            const token = jwt.sign(
                { email: email, },
                process.env.API_KEY,
                { expiresIn: process.env.TOKEN_LIFE}
            );
            const newRefreshToken = jwt.sign(
                { email: email, },
                process.env.REFRESH_TOKEN_API_KEY,
                { expiresIn: process.env.REFRESH_TOKEN_LIFE}
            );

            const response = {
                message: getReaponse('TOKEN-UPDATE'),
                token: token,
                refreshToken: newRefreshToken,
            }

            let newToken = tokensCreator(newRefreshToken);
            newToken.then(token => {
                if (token) {
                    res.status(response.message.statusCode).json(response);
                } else {
                    const message = getReaponse('DB-ERROR');
                    res.status(message.statusCode).json(message);
                }
            })
        } else {
            const message = getReaponse('TOKEN-WRONG');
            res.status(message.statusCode).json(message)
        }
    } catch (err) {
        console.log(err);
        const message = getReaponse('SERVER-ERROR');
        res.status(message.statusCode).json(message);
    };
};
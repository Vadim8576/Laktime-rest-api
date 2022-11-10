const bcrypt = require("bcrypt");
require('dotenv').config();
const client = require('../../db/db.js');
const jwt = require("jsonwebtoken");
const { tokensCreator } = require("../../helpers/tokensCreator.js");
const { getReaponse } = require("../../helpers/responses.js");
const { requestBodyFieldsChecker } = require("../../helpers/requestBodyFieldsChecker.js");
const tableName = 'laktime_users';

exports.login = async (req, res) => {
    let message;
    try {
        let body = await requestBodyFieldsChecker(req, res, tableName, 'nickname');
        if(!body) return
    
        const query = await client.query(`SELECT * FROM ${tableName} WHERE email=$1;`, [body.email]);
        const user = query.rows;

        if (user.length === 0) {
            message = getReaponse('EMAIL-NOT-FOUND');
            return res.status(message.statusCode).json(message);
        } else {
            bcrypt.compare(body.password, user[0].password, async (err, result) => {
                if (err) {
                    message = getReaponse('PASSWORD-WRONG');
                    res.status(message.statusCode).json(message);
                } else if (result === true) {      
                    const token = jwt.sign(
                        { email: body.email, },
                        process.env.API_KEY,
                        { expiresIn: process.env.TOKEN_LIFE}
                    );
                    const refreshToken = jwt.sign(
                        { email: body.email, },
                        process.env.REFRESH_TOKEN_API_KEY,
                        { expiresIn: process.env.REFRESH_TOKEN_LIFE}
                    );

                    message = getReaponse('LOGIN-OK', {
                        email: body.email,
                        nickname: user[0].nickname,
                        token: token,
                        refreshToken: refreshToken
                    });

                    const newToken = tokensCreator(refreshToken) // сохраняем в БД новый токен
                    newToken.then(token => {
                        if (token) {                           
                            res.status(message.statusCode).json({...message});
                        } else {
                            message = getReaponse('DB-ERROR');
                            res.status(message.statusCode).json(message);
                        }
                    })
                } else {
                    message = getReaponse('PASSWORD-WRONG');
                    if (result != true) res.status(message.statusCode).json(message);
                }
            })
        }
    } catch (err) {       
        message = getReaponse('DB-ERROR');
        res.status(message.statusCode).json(message);
    };
};


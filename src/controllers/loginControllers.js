const bcrypt = require("bcrypt");
require('dotenv').config(); // для работы с .env
const client = require('../db/db.js');
const jwt = require("jsonwebtoken");
const { tokensCreator } = require("../helpers/tokensCreator.js");
const { getReaponse } = require("../helpers/responses.js");
const { requestBodyFieldsChecker } = require("../helpers/requestBodyFieldsChecker.js");
const tableName = 'laktime_users';

exports.login = async (req, res) => {
    
    // const apikey = req.headers['api-key'] || null;
    // if(apikey !== process.env.SECRET_KEY) {
    //     const message = {'statusCode': 403, 'ok': false, message: 'Неверный API KEY!'}
    //     return res.status(403).json(message);
    // }

    // const { email, password } = req.body;


    let message;
    try {
        
        let body = await requestBodyFieldsChecker(req, res, tableName, 'nickname').then(response => response)
        if(!body) return
    

        const query = await client.query(`SELECT * FROM ${tableName} WHERE email=$1;`, [body.email]) //Verifying if the user exists in the database
        const user = query.rows;
        
        console.log('user = ', user)

        if (user.length === 0) {
            // const message = {'statusCode': 400, 'ok': false, error: 'Пользователь с таким именем не существует. Пожалуйста, зарегистрируйтесь'}
            message = getReaponse('EMAIL-NOT-FOUND');
            res.status(message.statusCode).json(message);
        } else {
            bcrypt.compare(body.password, user[0].password, async (err, result) => {
  
                if (err) {
                    // const message = {'statusCode': 500, 'ok': false, error: 'Неверный пароль'}
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
                    // const response = {
                    //     message,
                    //     token: token,
                    //     refreshToken: refreshToken,
                    // }
                    console.log(message)
                
                    // Создаем токен
                    let newToken = tokensCreator(refreshToken) // сохраняем в БД новый токен
                    newToken.then(token => {
                        // console.log('token = ', token)
                        if (token) {                           
                            res.status(message.statusCode).json({...message});
                        } else {
                            // const message = {'statusCode': 500, 'ok': false, error: 'Ошибка базы данных при входе!'}
                            message = getReaponse('DB-ERROR');
                            res.status(message.statusCode).json(message);
                        }
                    })
                } else {
                    // const message = {'statusCode': 400, 'ok': false, error: 'Введен неверный пароль!'}
                    message = getReaponse('PASSWORD-WRONG');
                    if (result != true) res.status(message.statusCode).json(message);
                }
            })
        }
    } catch (err) {
        // const message = {'statusCode': 500, 'ok': false, error: 'Произошла ошибка базы данных при входе в систему!'}
        message = getReaponse('DB-ERROR');
        res.status(message.statusCode).json(message);
    };
};


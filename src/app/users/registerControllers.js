const bcrypt = require("bcrypt");
require('dotenv').config();// для работы с .env
const client = require('../../db/db.js');
const jwt = require("jsonwebtoken");
const { getReaponse } = require("../../helpers/responses.js");
const { requestBodyFieldsChecker } = require("../../helpers/requestBodyFieldsChecker.js");
const tableName = 'laktime_users';

exports.register = async (req, res) => {
    let message;
    let body = await requestBodyFieldsChecker(req, res, tableName).then(response => response)
    if(!body) return

    try { 
        const query = await client.query(`SELECT * FROM ${tableName} WHERE email= $1;`, [body.email]); //Checking if user already exists
        const arr = query.rows;

        if (arr.length != 0) {
            // const message = {'statusCode': 400, 'ok': false, message: 'Электронная почта уже есть, нет необходимости регистрироваться снова'}
            message = getReaponse('EMAIL-ALREADY-EXISTS');
            return res.status(message.statusCode).json(message);
        } else {
            bcrypt.hash(body.password, 10, (err, hash) => {
                message = getReaponse('SERVER-ERROR');
                if (err) return res.status(message.statusCode).json(message);
                const user = {
                    nickname: body.nickname,
                    email: body.email,
                    password: hash,
                };
                let flag = 1;
                client.query(`INSERT INTO laktime_users (nickname, email, password) VALUES ($1,$2,$3);`, [user.nickname, user.email, user.password], (err) => {            
                    if (err) {
                        flag = 0; //If user is not inserted is not inserted to database assigning flag as 0/false.
                        // const message = {'statusCode': 500, 'ok': false, message: 'Ошибка базы данных!'}
                        message = getReaponse('DB-ERROR');
                        return res.status(message.statusCode).json(message)
                    } else {
                        flag = 1;
                        // const message = {'statusCode': 200, 'ok': true, message: 'Пользователь добавлен в базу данных'}
                        message = getReaponse('REGISTER-OK', {email: body.email, nickname: body.nickname});
                        return res.status(message.statusCode).json(message);
                    }
                });

                if (flag) {
                    const token = jwt.sign(
                        { email: user.email },
                        process.env.API_KEY
                    );
                }
            });
        }
    }
    catch (err) {
        console.log(err);
        // const message = {'statusCode': 500, 'ok': false, message: 'Ошибка базы данных при регистрации пользователя!'}
        message = getReaponse('DB-ERROR');
        res.status(message.statusCode).json(message);
    };
}

require('dotenv').config();
const bcrypt = require("bcrypt");
const client = require('../../../db/db.js');
const jwt = require("jsonwebtoken");
const { tokensCreator } = require("../../../helpers/tokensCreator.js");
const { getReaponse } = require("../../../helpers/responses.js");

const tableName = 'laktime_users';

exports.loginUser = async (req, res) => {
  const { body } = req;
  const query = await client.query(`SELECT * FROM ${tableName} WHERE email=$1;`, [body.email]);
  const user = query.rows;

  if (user.length === 0) {
    message = getReaponse('EMAIL-NOT-FOUND');
    return res.status(message.statusCode).json(message);
  }

  bcrypt.compare(body.password, user[0].password, async (err, result) => {
    if (err) {
      message = getReaponse('PASSWORD-WRONG');
      return res.status(message.statusCode).json(message);
    }

    if (result) {
      const token = jwt.sign(
        { email: body.email, },
        process.env.API_KEY,
        { expiresIn: process.env.TOKEN_LIFE }
      );
      const refreshToken = jwt.sign(
        { email: body.email, },
        process.env.REFRESH_TOKEN_API_KEY,
        { expiresIn: process.env.REFRESH_TOKEN_LIFE }
      );

      const newRefreshToken = tokensCreator(refreshToken); // сохраняем в БД новый токен

      newRefreshToken.then(refreshToken => {
        if (refreshToken) {
          message = getReaponse('LOGIN-OK', {
            email: body.email,
            nickname: user[0].nickname,
            token: token,
            refreshToken: refreshToken
          });
          return res.status(message.statusCode).json(message);
        } else {
          message = getReaponse('DB-ERROR');
          return res.status(message.statusCode).json(message);
        }
      });
    } else {
      message = getReaponse('PASSWORD-WRONG');
      return res.status(message.statusCode).json(message);
    }
  })
}
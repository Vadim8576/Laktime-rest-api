require('dotenv').config();
const client = require('../../db/db.js');
const jwt = require("jsonwebtoken");
const { getReaponse } = require("../../helpers/responses.js");
const { tokensCreator } = require('../../helpers/tokensCreator.js');


exports.refreshTokenModel = async (req, res, email) => {
  const refreshToken = req.header("x-refresh-token");

  let query = await client.query(`SELECT * FROM laktime_users WHERE email= $1;`, [email]);

  if (query.rows.length === 0) {
    const message = getReaponse('ACCESS-DENIED');
    return res.status(message.statusCode).json(message);
  }

  query = await client.query(`SELECT * FROM laktime_token;`)
  const oldTtoken = query.rows[0].token;

  if ((refreshToken) && (refreshToken === oldTtoken)) {
    const token = jwt.sign(
      { email: email, },
      process.env.API_KEY,
      { expiresIn: process.env.TOKEN_LIFE }
    );
    const newRefreshToken = jwt.sign(
      { email: email, },
      process.env.REFRESH_TOKEN_API_KEY,
      { expiresIn: process.env.REFRESH_TOKEN_LIFE }
    );

    const response = {
      message: getReaponse('TOKEN-UPDATE'),
      token: token,
      refreshToken: newRefreshToken,
    }

    const newToken = await tokensCreator(newRefreshToken);
    if (newToken) {
      return res.status(response.message.statusCode).json(response);
    } else {
      const message = getReaponse('DB-ERROR');
      return res.status(message.statusCode).json(message);
    }
  } else {
    const message = getReaponse('TOKEN-WRONG');
    return res.status(message.statusCode).json(message)
  }
}
const bcrypt = require("bcrypt");
require('dotenv').config();
const client = require('../../../db/db.js');
const jwt = require("jsonwebtoken");
const { getReaponse } = require("../../../helpers/responses.js");
const tableName = 'laktime_users';

exports.registerUser = async (req, res) => {
  const { body } = req;
  const password = body.password.toString();
  
  const query = await client.query(`SELECT * FROM ${tableName} WHERE email= $1;`, [body.email]); //Checking if user already exists
  const rows = query.rows;

  if (rows.length != 0) {
    message = getReaponse('EMAIL-ALREADY-EXISTS');
    return res.status(message.statusCode).json(message);
  } else {
    bcrypt.hash(password, 10, (err, hash) => {
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
          message = getReaponse('DB-ERROR');
          return res.status(message.statusCode).json(message)
        } else {
          flag = 1;
          message = getReaponse('REGISTER-OK', { email: body.email, nickname: body.nickname });
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
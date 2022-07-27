require('dotenv').config(); // для работы с .env
const client = require('../db/db.js');
const jwt = require("jsonwebtoken");


exports.tokensCreator = async (refreshToken) => {
    let response;
    try {
        let tokenQuery;
        let query = await client.query(`SELECT * FROM laktime_token;`)
        
        if(query.rows.length === 0) { //нет записей токенов в БД
            tokenQuery = await client.query(`INSERT INTO laktime_token(token) VALUES ('${refreshToken}')`);
        } else {
            const id = query.rows[0].id;
            // tokenQuery = await client.query(`DELETE FROM laktime_token`);
            tokenQuery = await client.query(`UPDATE laktime_token SET token='${refreshToken}' WHERE id='${id}'`);
        }
        response = true
    } catch(err) {
        console.log(err)
        response = false
    }
    
    return response
}


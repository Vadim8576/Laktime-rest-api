// const bcrypt = require("bcrypt");
require('dotenv').config(); // для работы с .env
// const client = require('../db/db.js');
// const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const { getReaponse } = require("../../helpers/responses.js");



exports.sendMail = async (req, res) => {
    let message;

    const {email, text} = req.body;
    let html = ''

    try {
/*
        РАБОЧИЙ КОД!!!!!!!
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        })
        let result = await transporter.sendMail({
            from: `"spavava" <${process.env.MAIL_USER}>`,
            to: email,
            subject: 'Message from Node js',
            text: text,
            html: html
        })
*/
        let testEmailAccount = await nodemailer.createTestAccount()

        let transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testEmailAccount.user,
                pass: testEmailAccount.pass,
            },
        })

        let result = await transporter.sendMail({
            from: '"Node js" <nodejs@example.com>',
            to: 'user@example.com, user@example.com',
            subject: 'Письмо с сайта Laktime.ru',
            text: 'Это присьмо отправлено с сайта Laktime.ru',
            html:
                'Это <i>письмо</i> отправлено с сайта <strong>Laktime.ru</strong>',
        })

        console.log(result)


        message = getReaponse('MAIL-OK');
    } catch (error) {
        console.log(error)
        message = getReaponse('MAIL-ERROR');
    }
    res.status(message.statusCode).json(message)
}
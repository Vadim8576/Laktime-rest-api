const express = require('express');
const router = express.Router();
const { sendMail } = require("../controllers/mailControllers");

router.post('/', sendMail);

module.exports = router;
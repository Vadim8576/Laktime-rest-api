const express = require('express');
const router = express.Router();
const {register} = require("./register/controllers");
const {login} = require("./login/controllers");

router.post('/register', register);
router.post('/login', login);

module.exports = router;
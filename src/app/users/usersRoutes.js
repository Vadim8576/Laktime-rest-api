const express = require('express');
const router = express.Router();
const {register} = require("./registerControllers");
const {login} = require("./loginControllers");

router.post('/register', register);
router.post('/login', login);

module.exports = router;
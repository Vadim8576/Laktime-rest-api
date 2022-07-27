const express = require('express');
const router = express.Router();
const auth = require('../middleware/tokenChecker');
const {register} = require("../controllers/registerControllers");
const {login} = require("../controllers/loginControllers");

router.post('/register', register);
router.post('/login', login);

module.exports = router;
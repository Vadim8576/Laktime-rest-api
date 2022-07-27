const express = require('express');
const router = express.Router();
const { refreshToken } = require('../controllers/refreshTokenControllers');

const refreshApiKeyChecker = require('../middleware/refreshTokenApiKeyChecker');
const refreshTokenChecker = require('../middleware/refreshTokenChecker');

router.post('/', refreshApiKeyChecker, refreshTokenChecker, refreshToken);

module.exports = router;
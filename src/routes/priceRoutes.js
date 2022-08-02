const express = require('express');
const router = express.Router();
const { addPrice, getPrices, getPrice, deleteAllPrices, deletePrice, patchPrice } = require("../controllers/priceControllers");
const tokenChecker = require("../middleware/tokenChecker");
const bodyChecker = require("../middleware/requestBodyChecker");




router.post('/', tokenChecker, bodyChecker, addPrice);
router.get('/', getPrices);
router.get('/:id', getPrice);
router.delete('/:id', tokenChecker, deletePrice);
router.put('/:id', tokenChecker, bodyChecker, patchPrice);
router.delete('/', tokenChecker, deleteAllPrices);


module.exports = router;
const express = require('express');
const router = express.Router();
const {
  addPrice,
  getPrices,
  getPrice,
  deleteAllPrices,
  deletePrice,
  patchPrice
} = require("./controllers");
const tokenChecker = require("../../middleware/tokenChecker");


router.post('/', tokenChecker, addPrice);
router.get('/', getPrices);
router.get('/:id', getPrice);
router.delete('/:id', tokenChecker, deletePrice);
router.put('/:id', tokenChecker, patchPrice);
router.delete('/', tokenChecker, deleteAllPrices);


module.exports = router;
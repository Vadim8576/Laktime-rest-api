const express = require('express');
const router = express.Router();
const {
  addService,
  getServices,
  getService,
  deleteAllServices,
  deleteService,
  patchService
} = require("./controllers");
const tokenChecker = require("../../middleware/tokenChecker");


router.post('/', tokenChecker, addService);
router.get('/', getServices);
router.get('/:id', getService);
router.put('/:id', tokenChecker, patchService);
router.delete('/:id', tokenChecker, deleteService);
router.delete('/', tokenChecker, deleteAllServices);


module.exports = router;
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
const { multer } = require('../images/multer');



router.post('/', tokenChecker, multer.single('image_name'), addService);
router.get('/', getServices);
router.get('/:id', getService);
router.put('/:id', tokenChecker, multer.single('image_name'), patchService);
router.delete('/:id', tokenChecker, deleteService);
router.delete('/', tokenChecker, deleteAllServices);


module.exports = router;
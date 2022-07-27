const express = require('express');
const router = express.Router();
const { addOrder, getOrder, getOrders, deleteAllOrders, deleteOrder, patchOrder } = require("../controllers/orderControllers");


const tokenChecker = require('../middleware/tokenChecker');

router.get('/', tokenChecker, getOrders);
router.post('/', addOrder); //заказ создает пользователь без регистрации, доступ без токена
router.get('/:id', tokenChecker, getOrder);
router.delete('/:id', tokenChecker, deleteOrder);
router.put('/:id', tokenChecker, patchOrder);
router.delete('/', tokenChecker, deleteAllOrders);


module.exports = router;
const express = require('express');
const chalk = require('chalk');
const mongoose = require('mongoose');
const authWare = require('../middlewares/auth');
const Order = require('../models/order');
const Product = require('../models/product');
const ordersController = require('../controllers/orders')(Order, Product);



const router = express.Router();


router.post('/', authWare, ordersController.post);
router.get('/', ordersController.get);
router.get('/:orderId', ordersController.getOrderById);
router.patch('/:orderId', authWare, ordersController.updateOrderByPatch);
router.delete('/:orderId', authWare, ordersController.deleteOrder);


module.exports = router;
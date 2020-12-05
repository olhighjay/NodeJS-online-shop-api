const express = require('express');
const chalk = require('chalk');
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');
const ordersController = require('../controllers/orders')(Order, Product);


const router = express.Router();


router.post('/', ordersController.post);
router.get('/', ordersController.get);
router.get('/:orderId', ordersController.getOrderById);
router.patch('/:orderId', ordersController.updateOrderByPatch);
router.delete('/:orderId', ordersController.deleteOrder);


module.exports = router;
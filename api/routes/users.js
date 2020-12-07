const express = require('express');
const chalk = require('chalk');
const mongoose = require('mongoose');
const User = require('../models/user');
const usersController = require('../controllers/users')(User);



const router = express.Router();


router.post('/signup', usersController.signUp);
router.post('/signin', usersController.signIn);
// router.get('/', ordersController.get);
// router.get('/:orderId', ordersController.getOrderById);
// router.patch('/:orderId', ordersController.updateOrderByPatch);
router.delete('/:orderId', usersController.deleteUser);


module.exports = router;
const express = require('express');
const chalk = require('chalk');
const mongoose = require('mongoose');
const Product = require('../models/product');
const productsController = require('../controllers/products')(Product);

// const debug = require('debug')('app:bookRoutes');
// const passport = require('passport');

const router = express.Router();

router.get('/', productsController.get);

router.post('/', productsController.post);

router.get('/:productId', productsController.getProductById);

router.patch('/:productId', productsController.updateProductByPatch);

router.delete('/:productId', productsController.deleteProduct);



module.exports = router;
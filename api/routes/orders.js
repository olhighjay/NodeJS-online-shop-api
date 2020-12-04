const express = require('express');
const chalk = require('chalk');
// const mongoClient  = require('mongodb').MongoClient;
// const debug = require('debug')('app:bookRoutes');
// const passport = require('passport');

const router = express.Router();

router.post('/', (req, res, next) => {
  const order = {
    productId: req.body.productId,
    quantity: req.body.quantity,
  }
    res.status(200).json({
      message: 'Order was created',
      order: order
    });
});


module.exports = router;
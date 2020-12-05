const express = require('express');
const chalk = require('chalk');
const mongoose = require('mongoose');
const multer = require('multer');
const Product = require('../models/product');
const productsController = require('../controllers/products')(Product);

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './api/public/images/');
  },
  filename: function(req, file, cb){
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) =>{
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    // Store file
    cb(null, true);
  } else{
    // Do  not store file
    cb(new Error('only images with jpeg and png extensions can be uploaded'), false);
  }
};

const upload = multer({
  storage: storage, 
  limits:{
    fileSize: 1024 * 1024 *5
  },
  fileFilter: fileFilter
});

// const debug = require('debug')('app:bookRoutes');
// const passport = require('passport');

const router = express.Router();

router.get('/', productsController.get);

router.post('/', upload.single('productImage'), productsController.post);

router.get('/:productId', productsController.getProductById);

router.patch('/:productId', productsController.updateProductByPatch);

router.delete('/:productId', productsController.deleteProduct);



module.exports = router;
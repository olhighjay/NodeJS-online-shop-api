const mongoose = require('mongoose');

const productSchema = mongoose.Schema;

const productModel = new productSchema(
  {
    _id:  mongoose.Schema.Types.ObjectId,
    name:  {type: String, required:true },
    price:  {type: Number, required:true },
  }
);

module.exports = mongoose.model('Product', productModel);
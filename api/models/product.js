const mongoose = require('mongoose');

const productSchema = mongoose.Schema;

const productModel = new productSchema(
  {
    _id:  mongoose.Schema.Types.ObjectId,
    name:  {type: String },
    genre:  {type: String },
    price:  {type: Number },
  }
);

module.exports = mongoose.model('Product', productModel);
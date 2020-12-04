function productsController(Product){
  function get(req, res, next){
    Product.find()
    .exec()
    .then(docs => {
        console.log(docs);
        res.status(200).json(docs);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err});
    });    
  };

  function post(req, res){
  
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price
    });
    product.save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Product was created',
        createdProduct: product
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
  };

  function getProductById(req, res, next){
    const id = req.params.productId;
    Product.findById(id)
    .exec()
    .then(doc => {
      if(doc){
        console.log("From database", doc);
        res.status(200).json(doc);
      }else{
        res.status(404).json({message: 'No valid entry found for provided ID'})
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err});
    });
  };

  function updateProductByPatch(req, res, next){
    const id = req.params.productId;
    // If I know what I want to update
    // Product.update({_id: id}, { $set: {name: req.body.newName, price: req.body.newPrice}})
    const updateOps = {};
    for (const ops of req.body){
      updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id}, { $set: updateOps})
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err});
    });
  }

  function deleteProduct(req, res, next){
    const id = req.params.productId;
    Product.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err});
    });
  }

  return {
    get, 
    post, 
    getProductById, 
    updateProductByPatch,
    deleteProduct
  };
}

module.exports = productsController;
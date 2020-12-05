function productsController(Product){
  function get(req, res, next){
    Product.find()
    .select("name price _id productImage")
    .exec()
    .then(docs => {
        const response = {
          count: docs.length,
          products: docs.map(doc => {
            return {
              name: doc.name,
              price: doc.price,
              productImage: doc.productImage,
              _id: doc._id,
              request: {
                type: 'GET',
                url: 'http://localhost:4000/api/products/' + doc._id
              }
            }
          })
        };
        res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err});
    });    
  };

  function post(req, res, next){
    console.log(req.file);
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
      productImage: req.file.path
    });
    product.save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Product was created',
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: 'GET',
            url: 'http://localhost:4000/api/products/' + result._id
          }
        }
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
    .select("name price _id productImage")
    .exec()
    .then(doc => {
      if(doc){
        console.log("From database", doc);
        res.status(200).json({
          product: doc,
          request: {
            type: 'GET',
            description: 'Get all the products', 
            url: 'http://localhost:4000/api/products/'
          }
        });
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
        res.status(200).json({
          message: "Product updated successfully",
          request: {
            type: 'GET',
            description: 'Get all the products', 
            url: 'http://localhost:4000/api/products/' + id
          }
        });
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
        res.status(200).json({
          message: "Product deleted successfully",
          request: {
            type: 'POST',
            description: 'Create new product products', 
            url: 'http://localhost:4000/api/products/',
            body: {name: 'String', price: 'Number'}
          }
        });
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
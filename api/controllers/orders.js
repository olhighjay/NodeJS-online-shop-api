
function ordersController(Order, Product){
  function get(req, res, next){
    Order.find()
    .select("product quantity _id")
    // If you wanty to populate all the details about product
    // .populate('product')
    .populate('product', 'name')

    .exec()
    .then(docs => {
        const response = {
          count: docs.length,
          order: docs.map(doc => {
            return {
              product: doc.product,
              quantity: doc.quantity,
              _id: doc._id,
              request: {
                type: 'GET',
                url: 'http://localhost:4000/api/orders/' + doc._id
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

  function post(req, res){
    Product.findById(req.body.productId)
     .then(product => {
        if(!product){
          return res.status(404).json({
            message: 'Product does not exist'
          });
        }
        const order = new Order({
          _id: new mongoose.Types.ObjectId(),
          product: req.body.productId,
          quantity: req.body.quantity
        });
        return order.save();
      })
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: 'Order was created',
          createdOrder: {
            quantity: result.quantity,
            product: result.product,
            _id: result._id,
            request: {
              type: 'GET',
              url: 'http://localhost:4000/api/orders/' + result._id
            }
          }
        });
      })
     .catch(err => {
        console.log(err);
        res.status(500).json({
          message: 'Product not found',
          error: err
        });
      });
   
  };

  function getOrderById(req, res, next){
    const id = req.params.orderId;
    Order.findById(id)
    .select("product quantity _id")
    .populate('product')
    .exec()
    .then(order => {
      if(order){
        console.log("From database", order);
        res.status(200).json({
          product: order,
          request: {
            type: 'GET',
            description: 'Get all the orders', 
            url: 'http://localhost:4000/api/orders/'
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

  function updateOrderByPatch(req, res, next){
    const id = req.params.productId;
    // If I know what I want to update
    Product.update({_id: id}, { $set: {name: req.body.newName, price: req.body.newPrice}})
    // const updateOps = {};
    // for (const ops of req.body){
    //   updateOps[ops.propName] = ops.value;
    // }
    // Product.update({_id: id}, { $set: updateOps})
    .exec()
    .then(result => {
        res.status(201).json({
          message: "Order updated successfully",
          request: {
            type: 'GET',
            description: 'View the order', 
            url: 'http://localhost:4000/api/orders/' + id
          }
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err});
    });
  }

  function deleteOrder(req, res, next){
    const id = req.params.orderId;
    Product.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
          message: "Order deleted successfully",
          request: {
            type: 'POST',
            description: 'Create new order', 
            url: 'http://localhost:4000/api/orders/',
            body: {product: 'String', quantity: 'Number'}
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
    getOrderById, 
    updateOrderByPatch,
    deleteOrder
  };
}

module.exports = ordersController;
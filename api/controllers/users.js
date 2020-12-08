const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const chalk = require('chalk');
// const { JsonWebTokenError } = require('jsonwebtoken');
function usersController(User){
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

  function signUp(req, res, next){
    //check for email uniqueness
    User.find({ email: req.body.email })
    .exec()
    .then(user =>{
      if(user.length > 0){
        return res.status(409).json({
          message: 'Email already taken by another user'
        });
      } else{
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if(err){
            return res.status(500).json({
              error:err
            });
          } else{       
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              name: req.body.name,
              email: req.body.email,
              password: hash
            });
            user.save()
            .then(result => {
              console.log(result);
              res.status(201).json({
                message: 'User was created successfully',
              });
            })
            .catch(err => {
              console.log(err);
              res.status(500).json({
                error: err
              });
            });
          }
        });
      };
    });
  };

  function signIn(req, res, next){
    //check for email uniqueness
    User.find({ email: req.body.email })
    .exec()
    .then(user =>{
      if(user.length < 1){
        return res.status(401).json({
          message: 'Auth Failed'
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        console.log(chalk.yellow(process.env.JWT_KEY));
        if(err){
            return res.status(401).json({
              message: 'Auth Failed'
            });
          }
          if(result){
            const token = jwt.sign({
              email: user[0].email,
              userId: user[0]._id
              }, process.env.JWT_KEY,
              {
                expiresIn: "1h"
              }
            );
            return res.status(200).json({
              message: 'Auth Successful',
              token:token
            });
          };
          return res.status(401).json({
            message: 'Auth Failed'
          });
      });
    });
  };

  function deleteUser(req, res, next){
    const id = req.params.orderId;
    User.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
          message: "User deleted successfully",
          request: {
            type: 'POST',
            description: 'Create new user', 
            url: 'http://localhost:4000/api/users/signup',
            body: {name: 'String', email: 'String', password: 'String'}
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
    signUp,
    signIn,
    deleteUser
  };
}

module.exports = usersController;
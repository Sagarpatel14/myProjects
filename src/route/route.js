const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const productController = require('../controllers/productController')
const cartController = require('../controllers/cartController')
const orderController = require('../controllers/orderController')
let {authentication, authorization } = require('../middleWares/auth')


//——————————————————————————————User APIs———————————————————————————————————————
router.post('/register', userController.createUser)
router.post('/login', userController.loginUser)
router.get('/user/:userId/profile',authentication,authorization, userController.getUser)
router.put('/user/:userId/profile',authentication,authorization, userController.updateUser)

//——————————————————————————————Product APIs———————————————————————————————————————
router.post('/products', productController.createProduct)
router.get('/products', productController.getProduct)
router.get('/products/:productId', productController.getProductById)
router.put('/products/:productId', productController.updateProduct)
router.delete('/products/:productId', productController.deleteProduct)

//——————————————————————————————Cart APIs———————————————————————————————————————
router.post('/users/:userId/cart',authentication,authorization, cartController.createCart)
router.get('/users/:userId/cart',authentication,authorization, cartController.getCart)
router.put('/users/:userId/cart',authentication,authorization, cartController.updateCart)
router.delete('/users/:userId/cart',authentication,authorization, cartController.deleteCart)

//——————————————————————————————Order APIs———————————————————————————————————————
router.post('/users/:userId/orders',authentication,authorization, orderController.createOrder)
router.put('/users/:userId/orders',authentication,authorization, orderController.updateOrder)


router.all('/*/', async function(req, res){
    res.status(404).send({status: false, msg: "Page Not Found!!!"})
})


module.exports=router;
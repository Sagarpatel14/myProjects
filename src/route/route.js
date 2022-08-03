const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const productController = require('../controllers/productController')
const cartController = require('../controllers/cartController')

router.post('/register', userController.createUser)
router.put('/user/:userId/profile', userController.updateUser)


router.post('/products', productController.createProduct)
router.get('/products', productController.getProduct)
router.get('/products/:productId', productController.getProductById)
router.put('/products/:productId', productController.updateProduct)
router.delete('/products/:productId', productController.deleteProduct)

router.post('/users/:userId/cart', cartController.createCart)
router.put('/users/:userId/cart', cartController.updateCart)
router.get('/users/:userId/cart', cartController.getCart)
router.delete('/users/:userId/cart', cartController.deleteCart)


router.all('/*/', async function(req, res){
    res.status(404).send({status: false, msg: "Page Not Found!!!"})
})



module.exports=router;
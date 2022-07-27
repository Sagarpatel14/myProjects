const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const productController = require('../controllers/productController')

router.post('/register',userController.createUser)


// router product
router.post('/products',productController.createProduct)


router.all('/*/', async function(req, res){
    res.status(404).send({status: false, msg: "Page Not Found!!!"})
})



module.exports=router;
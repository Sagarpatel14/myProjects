const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
<<<<<<< HEAD

router.post('/register', userController.createUser)
router.put('/user/:userId/profile', userController.updateUser)
=======
const productController = require('../controllers/productController')

router.post('/register',userController.createUser)


// router product
router.post('/products',productController.createProduct)

>>>>>>> 21b1e762858a224b79a27bf63c08930976363d9e

router.all('/*/', async function(req, res){
    res.status(404).send({status: false, msg: "Page Not Found!!!"})
})



module.exports=router;
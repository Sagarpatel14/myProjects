const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')

router.post('/register', userController.createUser)
router.put('/user/:userId/profile', userController.updateUser)

router.all('/*/', async function(req, res){
    res.status(404).send({status: false, msg: "Page Not Found!!!"})
})



module.exports=router;